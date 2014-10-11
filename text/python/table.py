import time
class Table(object):
    __name__ = "Table"
    def __init__(self, name, rows, cols, headers, data):
        self.name = name
        self.rows = rows
        self.cols = cols
        self.headers = headers
        self.data = [[data[y][x] for x in range(rows)] for y in range(cols)]
    def get(self, x, y = -1):
        if type(x) == int:
            if y == -1:
                return self.data[x]
            else:
                return self.data[x][y]
        else:
            if y == -1:
                return self.data[self.headers.index(x)]
            else:
                return self.data[self.headers.index(x)][y]
    def set(self, x, y, val):
        if type(x) == int:
            self.data[x][y] = val
        else:
            self.data[self.headers.index(x)][y] = val
    def __str__(self):
        temp = self.name + "\n"
        for h in self.headers:
            temp += h + "\t"
        for y in range(self.rows):
            temp += "\n"
            for x in range(self.cols):
                temp += str(self.data[x][y]) + "\t"
        return temp
    def __repr__(self):
        return "Table " + self.name
    def order(self, heads):
        x = 0
        for h in heads:
            self.switchCol(h, self.headers[x])
            x += 1
        return self
    def sort(self, heads):
        pass
    def switch(self, x1, x2):
        self.data[x1], self.data[x2] = self.data[x2], self.data[x1]
        return self
    def switchCol(self, head1, head2):
        x1 = self.headers.index(head1)
        x2 = self.headers.index(head2)
        self.switch(x1, x2)
        self.headers[x1] = head2
        self.headers[x2] = head1
        return self
    def __add__(self, other):
        if self.headers == other.headers:
            h = self.headers
            n = self.name + " and " + other.name
            d = [x[:] for x in self.data]
            for x in range(len(other.data)):
                for y in other.data[x]:
                    d[x].append(y)
            return Table(n, self.rows + other.rows, self.cols, h, d)
        else:
            h = self.headers + other.headers
            n = self.name + " and " + other.name
            d = self.data
            for x in other.data:
                d.append(x)
            return Table(n, self.rows, len(h), h, d)
    def match(self, search_params, condition, return_heads):
        def less(num1, num2):
            return num1 < num2
        def more(num1, num2):
            return num1 > num2
        def equal(num1, num2):
            return num1 == num2
        def nequal(num1, num2):
            return num1 != num2
        def lequal(num1, num2):
            return num1 <= num2
        def mequal(num1, num2):
            return num1 >= num2
        test = {"<": less,">": more,"==": equal,"!=": nequal, "<=": lequal, ">=": mequal}
        match = []
        no_match = []
        for p in search_params:
            t = search_params[p]
            x = self.headers.index(p)
            for y in range(self.rows):
                if condition == "and" or condition == "all":
                    if test[t[0]](self.data[x][y], t[1]) and not no_match.count(y):
                        match.append(y)
                    else:
                        no_match.append(y)
                        if match.count(y):
                            match.remove(y)
                if condition == "or" or condition == "any":
                    if test[t[0]](self.data[x][y], t[1]) and not match.count(y):
                        match.append(y)
                if condition == "xor" or condition == "one":
                    if test[t[0]](self.data[x][y], t[1]) and not match.count(y) and not no_match.count(y):
                        match.append(y)
                    elif match.count(y):
                        match.remove(y)
                        no_match.append(y)
        result = []
        if return_heads == "all" or return_heads == "*":
            return_heads = self.headers
        for h in return_heads:
            x = self.headers.index(h)
            temp = []
            for y in match:
                temp.append(self.data[x][y])
            result.append(temp)
        return Table(self.name + " match", len(match), len(return_heads), return_heads, result)
        
data = [["James", "Violet", "David", "James", "Brianna"],[19, 19, 20, 20, 19],[True, False, True, False, False]]
data1 = [["Matthew","Hannah"],[15, 21],[False, False]]
t = Table("Students", 5, 3, ["Name","Age","Comp Sci"], data)
t1 = Table("Others", 2, 3, ["Name","Age","Comp Sci"], data1)
t.match({"Name":("==", "James")},"or","*")
t1.match({"Age":("<", 20)}, "or", "*")
print t + t1.match({"Name":("<=", "James")},"or","*")
print t.order(["Age","Comp Sci","Name"])
