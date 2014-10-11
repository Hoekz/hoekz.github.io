from random import randint
canKeep = False
canRoll = True
canChoose = False
rolls = 0
dice = [0,0,0,0,0]
hold = [False,False,False,False,False]
score = 0
subscore = 0
options = ["1s","2s","3s","4s","5s","6s","3 of kind","4 of kind","chance",
           "full house","small straight","large straight","yahtzee"]
chosen = [False,False,False,False,False,False,False,False,False,False,False,
          False,False]
value = [25,30,40,50]
total = 0
while False in chosen:
    choice = input("Action: ")
    if choice == 'roll' and canRoll:
        rolls += 1
        canKeep,canRoll,canChoose = (rolls != 3),(rolls != 3),True
        total = 0
        for x in range(0, 5):
            if not hold[x]: dice[x] = randint(1,6)
            total += dice[x]
        print(dice)
        print(hold)
    elif choice == 'keep' and canKeep:
        print("Type dice number to be kept or dropped until done.")
        print(" Type 0 to finish.")
        select = 0
        while not select == -1:
            select = input("keep or drop:")
            try: select = int(select)  - 1
            except ValueError:
                print("Invalid Input")
                select = 5
            if select < 5 and select > -1:
                hold[select] = not hold[select]
            print(dice)
            print(hold)
    elif choice == 'choose' and canChoose:
        print("choices:")
        for x in range(0,13):
            if not chosen[x]: print(x + 1, ":", options[x])
        choice = input("choice: ")
        try: choice = int(choice) - 1
        except ValueError: continue
        if not (choice < 13 and choice > -1): continue
        if chosen[choice]: continue
        chosen[choice] = True
        if choice < 6:
            total = 0
            for x in range(0, 5):
                if dice[x] == choice + 1: total += dice[x]
            subscore += total
        elif choice < 9:
            count = dice.count(max(set(dice),key=dice.count))
            if choice == 6 and count < 3: total = 0
            elif choice == 7 and count < 4: total = 0
        else:
            total = 0
            s = list(set(dice))
            if choice == 12 and len(s) == 1: total = value[choice - 9]
            if choice == 9 and len(s) == 2:
                if dice.count(max(s,key=dice.count)) == 3:
                    total = value[choice - 9]
            if choice == 11 and (s == [1,2,3,4,5] or s == [2,3,4,5,6]):
                total = value[choice - 9]
            if choice == 10:
                b = [1,2,3,4]
                test1 = [x for x in range(len(s)) if s[x:x+len(b)] == b]
                b = [2,3,4,5]
                test2 = [x for x in range(len(s)) if s[x:x+len(b)] == b]
                b = [3,4,5,6]
                test3 = [x for x in range(len(s)) if s[x:x+len(b)] == b]
                if test1 or test2 or test3: total = value[choice - 9]   
        score += total
        canRoll,canKeep,canChoose = True,False,False
        hold = [False,False,False,False,False]
        rolls = 0
        print("score:", score)
        print("subscore:",subscore)
    elif choice == 'check score':
        print("score:", score)
        print("subscore:",subscore)
        print(dice)
        print(hold)
    else:
        print("That is not a valid entry. Valid entries currently:")
        if canRoll: print("roll")
        if canKeep: print("keep")
        if canChoose: print("choose")
        print("check score")
if subscore > 62: score += 35
print("Game Over.  Score:", score)
