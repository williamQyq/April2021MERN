import json


def main():

    msg = {
        'msg': "finished"
    }
    json_string = json.dumps(msg)
    print(json_string)


main()
