const get = (id) => document.getElementById(id);
const create = (type) => document.createElement(type);

const uploadBtn = get('upload');
const addGroupBtn = get('add-group');
const groups = get('groups');
const generateBtn = get('generate');
const output = get('output');
const exportBtn = get('export');

function save(data) {
    localStorage.setItem('data', JSON.stringify(data));
}

function load() {
    const stored = localStorage.getItem('data');

    if (!stored) {
        return { groups: [], result: [] };
    }

    return JSON.parse(stored);
}

function loadFile() {
    const file = this.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
        const data = JSON.parse(e.target.result);
        save(data);
        renderInputs(data);
        renderResult(data);
    };

    reader.readAsText(file);
}

function renderInputs(data) {
    groups.innerHTML = '';

    if (!data.groups.length) {
        groups.innerHTML = 'No groups yet.';
        return;
    }

    for (const group of data.groups) {
        const set = create('fieldset');
        set.className = 'group';

        const legend = create('legend');
        legend.innerHTML = `Group ${data.groups.indexOf(group) + 1}`;
        set.appendChild(legend);

        for (let i = 0; i < group.length; i++) {
            const input = create('input');
            input.value = group[i];
            input.className = 'person';
            input.addEventListener('input', () => {
                group[i] = input.value;
                save(data);
            });

            set.appendChild(input);
        }

        const add = create('button');
        add.className = 'add-person';
        add.innerHTML = 'Add Person';
        add.addEventListener('click', addPerson(data, group));
        set.appendChild(add);

        const remove = create('button');
        remove.className = 'remove-person';
        remove.innerHTML = 'Remove Person';
        remove.addEventListener('click', removePerson(data, group));
        set.appendChild(remove);

        const removeGroupBtn = create('button');
        removeGroupBtn.className = 'remove-group';
        removeGroupBtn.innerHTML = 'Remove Group';
        removeGroupBtn.addEventListener('click', removeGroup(data, group));
        set.appendChild(removeGroupBtn);

        groups.appendChild(set);
    }
}

function renderResult(data, mode) {
    output.innerHTML = '';

    if (!data.result.length) {
        output.innerHTML = 'Click Generate.';
        return;
    }

    const odd = mode === 'pairs' && data.result.length % 2;

    const groups = data.groups.map((group) => {
        return group.map((person) => {
            const index = data.result.indexOf(person);

            if (mode === 'pairs') {
                if (odd && index === 1) {
                    return [person, data.result[data.result.length - 1]];
                }

                if (odd && index === data.result.length - 1) {
                    return [person, data.result[0]];
                }

                return [person, data.result[index % 2 ? index - 1 : index + 1]];
            }

            if (mode === 'cycle') {
                return [person, data.result[index + 1] || data.result[0]];
            }

            return [person, 'unknown'];
        });
    });

    if (odd) {
        groups.push([
            [data.result[0], data.result[1]],
            [data.result[1], data.result[data.result.length - 1]],
            [data.result[data.result.length - 1], data.result[0]],
        ]);
    }

    for (const pairs of groups) {
        for (const pair of pairs) {
            const line = create('p');
            line.className = 'pair';
    
            const giver = create('span');
            giver.className = 'giver';
            giver.innerHTML = pair[0];
            line.appendChild(giver);
    
            line.appendChild(document.createTextNode(' gives to '));
    
            const receiver = create('span');
            receiver.className = 'receiver';
            receiver.innerHTML = pair[1];
            line.appendChild(receiver);
            output.appendChild(line);
        }

        output.appendChild(create('hr'));
    }
}

function addGroup() {
    const data = load();
    data.groups.push(['']);
    save(data);
    renderInputs(data);
}

function removeGroup(data, group) {
    return () => {
        const at = data.groups.indexOf(group);
        data.groups.splice(at, 1);
        save(data);
        renderInputs(data);
    };
}

function addPerson(data, group) {
    return () => {
        group.push('');
        save(data);
        renderInputs(data);
    };
}

function removePerson(data, group) {
    return () => {
        group.splice(group.length - 1, 1);
        save(data);
        renderInputs(data);
    };
}

function generate(mode) {
    const data = load();

    let result = secretSanta(data.groups);
    while (mode === 'pairs' && result.length % 2 && sameGroup(result[1], result[result.length - 1], data.groups)) {
        result = secretSanta(data.groups);
    }

    data.result = result;
    save(data);
    renderResult(data, mode);
}

function secretSanta(groups) {
    const count = groups.reduce((sum, array) => sum + array.length, 0);
    return generateSecretSantas(groups, [], count);
}

function generateSecretSantas(groups, list, count) {
    let chooseFrom = remainingPeople(groups, list)

    if (!chooseFrom.length) {
        if (list.length === count && !sameGroup(list[0], list[count - 1], groups)) {
            return list
        }
        return null
    }

    let newMember, newList

    do {
        newMember = random(chooseFrom)
        newList = generateSecretSantas(groups, [...list, newMember], count)
        chooseFrom = chooseFrom.filter(name => name !== newMember)
    } while(!newList && chooseFrom.length)

    return newList
}

function groupOf(name, groups) {
    return groups.find(group => group.includes(name))
}

function sameGroup(a, b, groups) {
    return groupOf(a, groups) === groupOf(b, groups)
}

function remainingPeople(groups, list) {
    const last = list[list.length - 1]

    if (!last) {
        return groups.reduce((arr, group) => [...arr, ...group], []);
    }

    const membersNotInLastGroup = groups
        .filter(group => !group.includes(last))
        .reduce((arr, group) => [...arr, ...group], []);

    return remove(membersNotInLastGroup, list);
}

function random(list) {
    const len = list.length
    return list[Math.floor(Math.random() * len)]
}

function remove(list, items) {
    return list.filter(item => !items.includes(item))
}

function exportFile() {
    const data = load();
    const text = JSON.stringify(data, null, 4);

    const link = document.createElement('a');
    link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    link.setAttribute('download', `secret-santa-${(new Date()).toISOString().slice(0, 10)}.json`);

    link.style.display = 'none';
    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
}

function run() {
    const data = load();
    renderInputs(data);
    renderResult(data, 'pairs');

    uploadBtn.addEventListener('change', loadFile);
    addGroupBtn.addEventListener('click', addGroup);
    generateBtn.addEventListener('click', (e) => {
        e.preventDefault();
        generate('pairs');
    });
    exportBtn.addEventListener('click', exportFile);
}

run();
