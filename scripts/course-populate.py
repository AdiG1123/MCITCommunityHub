from lxml import html
import requests
import re

import pprint

def prereq_identifier(prereq_text:str) -> list:
    '''
    Given an input string with prereq requirements for a class identify the prereq and coreq classes.
    All rule based so this function is not guaranteed to work on all strings and will fail if there is more 
    than one coreq before the word corequisite is found'
    '''
    pattern = re.compile(r"((?:CIS|CIT|ESE) \d{4})")
    print(prereq_text)
    coreq_check = re.finditer(r"corequisite|co-requisite", prereq_text, re.I)
    initial_find = None
    for match in coreq_check:
        if match:
            initial_find = re.findall(pattern, prereq_text[match.span()[1]:-1])
            if initial_find is None:
                initial_find = re.findall(pattern, prereq_text)[-1]
        
    all_courses = re.findall(pattern, prereq_text)
    prereqs = []
    for course in all_courses:
        if not initial_find:
            prereqs.append((course, False))  
        elif course not in initial_find:
            prereqs.append((course, False))
        else:
            prereqs.append((course, True))
    return prereqs



link = requests.get("https://online.seas.upenn.edu/degrees/mcit-online/academics/")
dom_tree = html.fromstring(link.content)

course_overlay_1 = '//*[@id="coursesblock_031ec56dfd56ae09e03931cfeba11f45"]/div'
course_overlay_2 = '//*[@id="coursesblock_cab20eb916748b85e00f9cb956c2b79d"]/div'
course_overlays_1 = dom_tree.xpath(course_overlay_1)
course_overlays_2 = dom_tree.xpath(course_overlay_2)
all_overlays = course_overlays_1 + course_overlays_2
# print(all_overlays)
# print(all_overlays[0].xpath("/div/div//text()"))
desc_prereq_1 = dom_tree.xpath('//*[@id="coursesblock_031ec56dfd56ae09e03931cfeba11f45"]/div/div/div//text()')
desc_prereq_2 = dom_tree.xpath('//*[@id="coursesblock_cab20eb916748b85e00f9cb956c2b79d"]/div/div/div//text()')
desc_prereq = desc_prereq_1 + desc_prereq_2

#print(desc_prereq)


updated_desc_prereq = [ele.strip() for ele in desc_prereq]
cleaned_info = list(filter(lambda x: True if x not in ["", 'Close'] else False, updated_desc_prereq))

# print(cleaned_info)

grouped = []
start_index = None
for i, ele in enumerate(cleaned_info):
    if re.search(r"^((?:CIS|CIT|ESE) \d{4})$", ele):
            if start_index is None:
                start_index = i
            if start_index != i:
                if cleaned_info[i-1] == 'Pre-Requisites':
                    continue
                else:     
                    grouped.append(cleaned_info[start_index:i])
                    start_index = i

course_info_complete = {}
#print(grouped)
for c_info in grouped:
     course_info_complete[c_info[0]] = {}    
     course_info_complete[c_info[0]]['course_number'] = int(c_info[0].split(' ')[1])
     course_info_complete[c_info[0]]['course_name'] = c_info[1]
     for i, info in enumerate(c_info):
            start_index = 2
            if info == 'Pre-Requisites':
                prereq_start_index = i
                course_info_complete[c_info[0]]['course_desc'] = ", ".join(c_info[start_index:i])
            if info == 'Course Units':
                course_info_complete[c_info[0]]['course_prereq'] = prereq_identifier(", ".join(c_info[prereq_start_index + 1: i]))

pprint.pprint(course_info_complete)



