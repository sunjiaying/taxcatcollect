# -*- coding: utf-8 -*-
from PIL import Image
from pytesseract import image_to_string
import re
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support.expected_conditions import presence_of_element_located
from fake_useragent import UserAgent

import time

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
            print('识别出来的位数不正确 ' + code.strip())
            return ''
        else:
            return code
    except Exception as e:
        print(e)

password = ''
try:
    f = open("./password")
    password = f.readline()
    f.close()
except Exception as e:
    print('没有找到密码文件')
    

fn = './image.png'
ua = UserAgent()
options = webdriver.ChromeOptions()
options.add_argument('no-sandbox')
# options.add_argument('disable-dev-shm-usage')
options.add_argument('user-agent="%s"'%ua.random) 
options.add_argument('headless')
# options.add_argument('disable-gpu')

with webdriver.Chrome(options=options) as driver:
    driver.get('https://u.jss.com.cn/Contents/usercenter/allow/login/login.jsp?redirecturl=bmjc')    
    driver.find_element_by_name('username').send_keys('13825229420')
    driver.find_element_by_name('password').send_keys(password)

    vcode = ''
    
    while(1):
        while(vcode==''):            
            driver.find_element_by_xpath("//input[@name='vcode']/../img[1]").click()
            time.sleep(2)
            try:
                code_result = driver.find_element_by_xpath("//input[@name='vcode']/../img[1]")
                screenshot = code_result.screenshot_as_png
                with open(fn, 'wb') as f:
                    f.write(screenshot)

                vcode = regCode(fn)
            except Exception as e:
                vcode = ''
        
        driver.find_element_by_xpath("//input[@name='vcode']").click()
        driver.find_element_by_xpath("//input[@name='vcode']").clear()
        driver.find_element_by_xpath("//input[@name='vcode']").send_keys(vcode + Keys.RETURN)
        
        time.sleep(1)
        if driver.current_url=='https://u.jss.com.cn/Contents/usercenter/allow/login/login.jsp?redirecturl=bmjc':
            vcode = ''
        elif driver.current_url=='https://bmjc.jss.com.cn/Contents/smartCode/web/index.html#/index':
            c = ''
            for cookie in driver.get_cookies():
                a = "%s=%s" % (cookie['name'], cookie['value'])
                if c == '':
                    c = a
                else:
                    c = c + '; ' + a
            print(c)
            with open('./cookies', 'w') as f:
                f.write(c)
            break
        else:
            print('正在跳转中...')
            print(driver.current_url)
            print(driver.page_source)
            print('获取失败')
            break