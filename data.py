def remove_column(column, header, data):
    header.pop(column)
    for day in data:
        day.pop(column)

def print_db(database: list[dict[str, any]]):
    headers_set = set()
    for value in database:
        for column in value:
            headers_set.add(column)
    
    headers = list(headers_set)
    content = ["-" for _ in database for _ in headers]
    for i, value in enumerate(database):
        for key, data in value.items():
            j = headers.index(key)
            content[i][j] = data

    s = ""
    s += "<table><theader>"
    for data in headers:
        s += f"<th>{data}</th>"
    s += "</theader><tbody>"
    for row in content:
        s += "<tr>"
        for data in row:
            s += f"<td>{data}</td>"
        s += "</tr>"
    s += "</tbody></table>"
    return s


print("""<link href="database.css" rel="stylesheet">\n""")

if __name__ == "__main__":
    with open("data.txt", "r", encoding="utf-8") as f:
        s = f.read()
    
    data = s.split("\n")
    data = [day.split("\t") for day in data if day]
    header = data.pop(0)

    remove_column(1, header, data)

    i = 0
    while i < len(header):
        if header[i] in ["时间", "统计"]:
            remove_column(i, header, data)
        else:
            i += 1

    subject = "其他"
    for i, column in enumerate(header):
        if i == 0:
            continue

        if column != "":
            subject = column
        
        for day in data:
            if day[i]:
                day[i] = subject + "-" + day[i]
                day[i] = day[i].split("-")
                if len(day[i]) > 2 and day[i][1] == "交":
                    day[i][0], day[i][1] = day[i][1], day[i][0]


    print("|", " | ".join(header), "|")
    for _ in header:
        print("|---", end="")
    print("|")
    for day in data:
        print("|", " | ".join(str(x) for x in day), "|")

    import json
    with open("data.json", "w", encoding="utf-8") as f:
        json.dump(data, f)
    


    
