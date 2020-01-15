# -*- coding: utf-8 -*-
from PIL import Image
from pytesseract import image_to_string
import re
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support.expected_conditions import presence_of_element_located


def regCode(filename):
    im = Image.open(filename)

    for i in range(1, 5):
        # 灰度图
        lim = im.convert('L')
        # 灰度阈值设为165，低于这个值的点全部填白色
        threshold = 155
        table = []

        for j in range(256):
            if j < threshold:
                table.append(0)
            else:
                table.append(1)

    bim = lim.point(table, '1')
    bim.save('./clean.png')

    try:
        code = image_to_string(bim, lang='eng', config='--psm 8')
        info = re.findall(r'[0-9a-zA-Z]', str(code))
        code = ''.join(info)
        if len(code.strip()) != 4:
            print('识别出来的位数不正确')
        print(code)
    except Exception as e:
        print(e)


fn = './image.png'

options = webdriver.ChromeOptions()
options.add_argument('no-sandbox')
options.add_argument('disable-dev-shm-usage')
options.add_argument('headless')
options.add_argument('disable-gpu')

with webdriver.Chrome(options=options) as driver:
    wait = WebDriverWait(driver, 10)
    driver.get('https://u.jss.com.cn/Contents/usercenter/allow/login/login.jsp?redirecturl=bmjc')
    code_result = wait.until(presence_of_element_located((By.CLASS_NAME, 'x-img')))
    scrrenshot = code_result.screenshot_as_png
    with open(fn, 'wb') as f:
        f.write(scrrenshot)

    regCode(fn)