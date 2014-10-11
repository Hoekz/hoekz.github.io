"""Containing file of Table Class"""
import datetime

class Table(object):
    """Used to make a table from data.
    PROPERTIES:
    --name: the name of the table (str)
    --rows: number of rows in table (int)
    --cols: number of cols in table (int)
    --headers: column names of table ([str])
    --data: data in table ([[type]])
    --file: file to save to
    FUNCTIONS:
    --constructor: pass in [name [,rows [,cols [,headers [,data]]]]]
    --toFile: write to file 'fileName'
    --fromFile: read from file 'fileName'
    --save: save to self.file (if set)
    --col: get a column or cell of data (from name or index)
    --row: get a dictionary version of a row
    --set: set a cell of data (by name or index)
    --add: add a row of data (tuple or dictionary)
    --order: dictate the order of the columns
    --sort: sort the data by a column ascending or descending
    --purge: removes all duplicate rows
    --merge: appends two tables of the same columns or rows, purging overlap
    --overlay: overlay two tables that have common column(s)
    --switch: switch data between columns (in case of incorrect labeling)
    --switchCol: switch the order of two columns
    --match: returns a table of matches to the specified parameters
    --delete: removes the specified row or column (column must be by head)
    --operator+: appends two tables (does not purge)
    --print: prints table name, heads, and data"""
    __name__ = "Table"
    def __init__(self, name = "", rows = 0, cols = 0, headers = [], data = []):
        """constructor:
    all arguments have defaults and can be set later
    if any data is passed in, it must coincide to the rows and cols
    if no data is passed in, empty lists will be created for each col"""
        self.file = ""
        self.name = name
        self.rows = rows
        self.cols = cols
        self.headers = headers
        if len(data):
            self.data = [[data[y][x] for x in range(rows)] for y in range(cols)]
        else:
            self.data = [[] for x in range(cols)]
        return self
    def toFile(self, fileName):
        """toFile:
    write the table to a file (extension .tbl is recommended)
    this will automatically resize the table to fit the data"""
        f = open(fileName, "w")
        data = ""
        for x in range(self.cols):
            if len(self.data[x]) > 0:
                data += type(self.data[x][0]).__name__ + ","
            else:
                data += "str,"
        self.rows = len(self.data[0])
        data += "\n" + str(self.rows) + "," + str(self.cols) + "\n"
        data += self.__str__()
        f.write(data)
        f.close()
    def fromFile(self, fileName):
        """fromFile:
    imports a table from a file (extension .tbl is recommended)
    since the datatypes must be translated, only supported datatypes should be used
    supports: int, float, str, bool, datetime"""
        self.file = fileName
        gtypes = {
            "int": int,
            "float": float,
            "str": str,
            "bool": lambda x: x == 'True',
            "datetime": datetime
        }
        f = open(fileName, "r")
        lines = f.readlines()
        f.close()
        types = lines[0].split(",")[:-1]
        headers = lines[3].split("\t")[:-1]
        dims = lines[1].split(",")
        name = lines[2][:-1]
        data = []
        raw = [x.split("\t")[:-1] for x in lines[4:]]
        for t in range(len(types)):
            data.append([gtypes[types[t]](x[t]) for x in raw])
        self.headers = headers
        self.rows, self.cols = int(dims[0]), int(dims[1])
        self.name = name
        self.data = data
        return self
    def save(self):
        """save:
    saves to the file table was loaded from (nothing if not loaded from file)"""
        if self.file:
            self.toFile(self.file)
        else:
            print "ERROR: Table " + self.name + " was not imported from a file."
    def col(self, x, y = -1):
        """col:
    returns the data from a specified column or head or cell"""
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
    def row(self, y):
        """row:
    returns the specified row as a dictionary with headers as keys"""
        temp = {}
        x = 0
        for h in self.headers:
            temp[h] = self.data[x][y]
            x += 1
        return temp
    def set(self, x, y, val):
        """set:
    set a cell or row
    cells are set by index or header for x, index for y
    rows are set by tuple for x, index for y, dictionary for val"""
        if type(x) == int:
            self.data[x][y] = val
        elif type(x) == tuple:
            for h in val:
                self.data[self.headers.index(h)][y] = val[h]
        else:
            self.data[self.headers.index(x)][y] = val
        return self
    def add(self, data):
        """add:
    adds a new row of data
    allows for adding while keeping data hidden"""
        if type(data) == tuple:
            for i in range(len(data)):
                self.data[i].append(data[i])
        else:
            for h in data:
                self.data[self.headers.index(h)].append(data[h])
        if len(self.data[0]) == self.rows  + 1:
            self.rows += 1
    def __str__(self):
        """print Table:
    prints the table to the console"""
        temp = self.name + "\n"
        for h in self.headers:
            temp += h + "\t"
        for y in range(self.rows):
            temp += "\n"
            for x in range(self.cols):
                if y < len(self.data[x]):
                    temp += str(self.data[x][y]) + "\t"
                else:
                    temp += "-no data-\t"
        return temp
    def __repr__(self):
        """represent:
    represent the table by its name"""
        return "Table " + self.name
    def order(self, heads):
        """order:
    sets the order of the columns of data
    do not have to pass in list of all heads, can just pass one, two, etc.
    the heads passed will be put in that order, others will simply shift"""
        x = 0
        for h in heads:
            self.switchCol(h, self.headers[x])
            x += 1
        return self
    def sort(self, head, asc):
        """sort:
    sorts the data by the given head or index and whether it should be ascending or descending
    chain together sorts to sort by a hiearchy of heads"""
        d = self.data
        if type(head) != int:
    	    head = self.headers.index(head)
        for i in range(self.rows - 1):
            for j in range(i + 1, self.rows):
                if (d[head][j] < d[head][i] and asc) or (d[head][j] > d[head][i] and not asc):
                    for k in range(self.cols):
                        d[k][i], d[k][j] = d[k][j], d[k][i]
        return self
    def purge(self):
        """purge:
    removes all duplicate rows (not cells)"""
        y = 1
        while y < self.rows:
            t = 0
            while t < y and y < self.rows:
                match = True
                for x in range(self.cols):
                    if self.data[x][y] != self.data[x][t]:
                        match = False
                        break
                if match:
                    for x in range(self.cols):
                        del self.data[x][y]
                    t -= 1
                    self.rows -= 1
                t += 1
            y += 1
        return self
    def merge(self, other):
        """merge:
    merges two tables either by rows or columns and then purges"""
        temp = (self + other).purge()
        self.name = temp.name
        self.rows = temp.rows
        self.cols = temp.cols
        self.headers = temp.headers
        self.data = temp.data
        return self
    def overlay(self, other):
        """overlay:
    uses common columns to overlay two tables"""
        for i in range(other.cols):
            if self.headers.index(other.headers[i]) == 0:
                self.headers.append(other.headers[i])
                self.data.append(other.data[i])
                self.cols += 1
        return self
    def switch(self, x1, x2):
        """switch:
    switches two columns of data (not the heads)"""
        self.data[x1], self.data[x2] = self.data[x2], self.data[x1]
        return self
    def switchCol(self, head1, head2):
        """switchCol:
    switches the positions of two columns"""
        x1 = self.headers.index(head1)
        x2 = self.headers.index(head2)
        self.switch(x1, x2)
        self.headers[x1] = head2
        self.headers[x2] = head1
        return self
    def __add__(self, other):
        """add (+):
    returns the soft merge (no purge) of two tables
    tables must either align in headers or in row count
    returned table merges resized versions of passed tables"""
        if self.headers == other.headers:
            h = self.headers
            n = self.name + " and " + other.name
            d = [x[:] for x in self.data]
            for x in range(len(other.data)):
                for y in other.data[x]:
                    d[x].append(y)
            return Table(n,  len(d[0]), self.cols, h, d)
        else:
            h = self.headers + other.headers
            n = self.name + " and " + other.name
            d = self.data
            for x in other.data:
                d.append(x)
            return Table(n, self.rows, len(h), h, d)
    def match(self, search_params, condition, return_heads):
        """match:
    returns table of matching values with headers in return_heads
    search params should be a dictionary with keys to match headers
    and values of tuples consisting of a comparison string (==, >, etc.)
    and the value to be compared to
    condition can be (and, all), (or, any), (xor, one)
    return heads is either list of heads or (*, all) to return all headers"""
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
    def delete(self, y):
        """delete:
    deletes the specified row or column of data
    row is passed by integer
    column is passed by header (string)"""
        if type(y) == str:
            del self.data[self.headers.index(h)]
            self.headers.remove(h)
        else:
            for i in range(self.cols):
                del self.data[i][y]
        return self