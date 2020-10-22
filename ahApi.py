import sys
import json 
import os
import validators
from appiepy import Product
from pprint import pprint

def RepresentsInt(s):
    try: 
        int(s)
        return True
    except ValueError:
        return False

valid=validators.url(sys.argv[3])
canRun=False

if valid==True:
    try:
        product = Product(sys.argv[3])
        productConverted = vars(product)
        productInfo = {
            "brand": productConverted["brand"],
            "category": productConverted["category"],
            "description": productConverted["description"],
            "image_url": productConverted["image_url"],
            "is_available": productConverted["is_available"],
            "is_discounted": productConverted["is_discounted"],
            "price_current": productConverted["price_current"],
            "price_previous": productConverted["price_previous"],
            "unit_size": productConverted["unit_size"],
            "url": productConverted["url"]
        }
        canRun=True
    except:
        canRun = False
        pprint(canRun)


if RepresentsInt(sys.argv[1]) and RepresentsInt(sys.argv[2]) and canRun == True:
    discordUserId = sys.argv[1]
    discordServer = sys.argv[2]

    fileName =  discordServer + "-" + discordUserId + "-product-info.json"
    ahDirectory = "ah-product"
    fileDirectory = str(ahDirectory + "/" + fileName)

    if not os.path.exists(ahDirectory):
        os.makedirs(ahDirectory)

    with open(fileDirectory, 'w') as outfile:
        json.dump(productInfo, outfile)
        pprint(fileName)
        pprint("Hello World")