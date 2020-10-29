import sys
import json 
import os
import validators
from appiepy import Product
from pprint import pprint

# Check if variable is a int
def RepresentsInt(s):
    try: 
        int(s)
        return True
    except ValueError:
        return False

# Create base variables
valid=validators.url(sys.argv[3])
canRun=False

# Check if third argument given is a url
if valid==True:
    try:
        # Get the product
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


#Check if product argumets asked are right and if system can run
if RepresentsInt(sys.argv[1]) and RepresentsInt(sys.argv[2]) and canRun == True:
    discordUserId = sys.argv[1]
    discordServer = sys.argv[2]

    # Create file directory
    fileName =  discordServer + "-" + discordUserId + "-product-info.json"
    ahDirectory = "ah-product"
    fileDirectory = str(ahDirectory + "/" + fileName)

    #Check if the path exists if not make it
    if not os.path.exists(ahDirectory):
        os.makedirs(ahDirectory)

    # Create file and send data of file to user
    with open(fileDirectory, 'w') as outfile:
        json.dump(productInfo, outfile)
        pprint(fileName)
        pprint("Hello World")