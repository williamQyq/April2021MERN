# script.py
import sys
import json

# obj = json.loads(sys.argv[1])
adic = [{"_id":"611431d814c6b148f0fc0bb4","link":"1","name":"HP OMEN - 16.1\" Laptop - AMD Ryzen 7 - 16GB Memory - AMD Radeon™ RX 6600M - 1TB SSD","price":999,"date":"2021-08-11T20:23:52.159Z","__v":0}]

jsonString = json.dumps(adic)
print(jsonString)

sys.stdout.flush()