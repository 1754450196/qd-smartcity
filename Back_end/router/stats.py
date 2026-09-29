# router/district.py
from fastapi import APIRouter, HTTPException

router = APIRouter()

DISTRICT_DATA = {
    "370202": {
        "info": {"code": "370202", "name": "市南区"},
        "yearly": [
            {"year": 2020, "gdp": 1823.5, "population": 567000},
            {"year": 2021, "gdp": 1956.2, "population": 569000},
            {"year": 2022, "gdp": 2034.8, "population": 571000},
            {"year": 2023, "gdp": 2186.3, "population": 572000},
            {"year": 2024, "gdp": 2312.7, "population": 574000},
            {"year": 2025, "gdp": 2489.1, "population": 575000},
        ],
        "poi": {
            "hospital": 23,
            "school": 86,
            "scenic": 18,
            "shopping": 312,
            "restaurant": 2841,
            "transport": 45
        },
        "company": {
            "finance": 1240,       # 金融业
            "retail": 3860,        # 零售业
            "realestate": 560,     # 房地产
            "tech": 890,           # 科技互联网
            "manufacturing": 320,  # 制造业
            "tourism": 480,        # 旅游服务
            "logistics": 210       # 物流运输
        },
        "tax": {
            "vat": 42.3,              # 增值税（亿元）
            "corporate_income": 28.6, # 企业所得税
            "consumption": 8.2,       # 消费税
            "personal_income": 15.4,  # 个人所得税
            "other": 6.8              # 其他
        }
    },
    "370203": {
        "info": {"code": "370203", "name": "市北区"},
        "yearly": [
            {"year": 2020, "gdp": 1456.3, "population": 1020000},
            {"year": 2021, "gdp": 1523.8, "population": 1025000},
            {"year": 2022, "gdp": 1598.4, "population": 1030000},
            {"year": 2023, "gdp": 1687.2, "population": 1038000},
            {"year": 2024, "gdp": 1789.6, "population": 1045000},
            {"year": 2025, "gdp": 1902.3, "population": 1052000},
        ],
        "poi": {
            "hospital": 31,
            "school": 124,
            "scenic": 8,
            "shopping": 486,
            "restaurant": 4230,
            "transport": 68
        },
        "company": {
            "finance": 860,
            "retail": 5240,
            "realestate": 420,
            "tech": 680,
            "manufacturing": 890,
            "tourism": 320,
            "logistics": 580
        },
        "tax": {
            "vat": 36.8,
            "corporate_income": 22.4,
            "consumption": 6.5,
            "personal_income": 12.8,
            "other": 5.2
        }
    },
    "370211": {
        "info": {"code": "370211", "name": "黄岛区"},
        "yearly": [
            {"year": 2020, "gdp": 4200.6, "population": 1200000},
            {"year": 2021, "gdp": 4523.4, "population": 1230000},
            {"year": 2022, "gdp": 4812.7, "population": 1265000},
            {"year": 2023, "gdp": 5134.2, "population": 1300000},
            {"year": 2024, "gdp": 5489.8, "population": 1340000},
            {"year": 2025, "gdp": 5876.3, "population": 1380000},
        ],
        "poi": {
            "hospital": 42,
            "school": 198,
            "scenic": 26,
            "shopping": 624,
            "restaurant": 5680,
            "transport": 92
        },
        "company": {
            "finance": 1120,
            "retail": 4380,
            "realestate": 780,
            "tech": 1560,
            "manufacturing": 3240,
            "tourism": 560,
            "logistics": 1890
        },
        "tax": {
            "vat": 86.4,
            "corporate_income": 54.2,
            "consumption": 18.6,
            "personal_income": 28.3,
            "other": 12.4
        }
    },
    "370212": {
        "info": {"code": "370212", "name": "崂山区"},
        "yearly": [
            {"year": 2020, "gdp": 1680.2, "population": 380000},
            {"year": 2021, "gdp": 1823.6, "population": 388000},
            {"year": 2022, "gdp": 1956.4, "population": 393000},
            {"year": 2023, "gdp": 2112.8, "population": 399000},
            {"year": 2024, "gdp": 2289.3, "population": 406000},
            {"year": 2025, "gdp": 2478.5, "population": 413000},
        ],
        "poi": {
            "hospital": 15,
            "school": 62,
            "scenic": 34,
            "shopping": 186,
            "restaurant": 1680,
            "transport": 38
        },
        "company": {
            "finance": 980,
            "retail": 1560,
            "realestate": 340,
            "tech": 2340,
            "manufacturing": 560,
            "tourism": 890,
            "logistics": 320
        },
        "tax": {
            "vat": 38.6,
            "corporate_income": 32.4,
            "consumption": 5.8,
            "personal_income": 18.6,
            "other": 7.2
        }
    },
    "370213": {
        "info": {"code": "370213", "name": "李沧区"},
        "yearly": [
            {"year": 2020, "gdp": 890.4,  "population": 560000},
            {"year": 2021, "gdp": 956.8,  "population": 572000},
            {"year": 2022, "gdp": 1023.6, "population": 583000},
            {"year": 2023, "gdp": 1098.4, "population": 592000},
            {"year": 2024, "gdp": 1186.2, "population": 600000},
            {"year": 2025, "gdp": 1289.7, "population": 608000},
        ],
        "poi": {
            "hospital": 18,
            "school": 89,
            "scenic": 6,
            "shopping": 268,
            "restaurant": 2340,
            "transport": 52
        },
        "company": {
            "finance": 420,
            "retail": 2860,
            "realestate": 280,
            "tech": 560,
            "manufacturing": 1240,
            "tourism": 180,
            "logistics": 460
        },
        "tax": {
            "vat": 22.4,
            "corporate_income": 14.6,
            "consumption": 3.8,
            "personal_income": 8.6,
            "other": 3.2
        }
    },
    "370214": {
        "info": {"code": "370214", "name": "城阳区"},
        "yearly": [
            {"year": 2020, "gdp": 1320.6, "population": 780000},
            {"year": 2021, "gdp": 1423.8, "population": 810000},
            {"year": 2022, "gdp": 1536.4, "population": 845000},
            {"year": 2023, "gdp": 1658.2, "population": 880000},
            {"year": 2024, "gdp": 1798.6, "population": 916000},
            {"year": 2025, "gdp": 1956.3, "population": 952000},
        ],
        "poi": {
            "hospital": 26,
            "school": 112,
            "scenic": 12,
            "shopping": 342,
            "restaurant": 3120,
            "transport": 86
        },
        "company": {
            "finance": 680,
            "retail": 3240,
            "realestate": 460,
            "tech": 1240,
            "manufacturing": 2160,
            "tourism": 340,
            "logistics": 980
        },
        "tax": {
            "vat": 32.6,
            "corporate_income": 21.4,
            "consumption": 5.2,
            "personal_income": 12.4,
            "other": 4.8
        }
    },
    "370215": {
        "info": {"code": "370215", "name": "即墨区"},
        "yearly": [
            {"year": 2020, "gdp": 1050.3, "population": 1100000},
            {"year": 2021, "gdp": 1136.8, "population": 1120000},
            {"year": 2022, "gdp": 1228.4, "population": 1145000},
            {"year": 2023, "gdp": 1326.2, "population": 1170000},
            {"year": 2024, "gdp": 1438.6, "population": 1195000},
            {"year": 2025, "gdp": 1568.4, "population": 1220000},
        ],
        "poi": {
            "hospital": 34,
            "school": 156,
            "scenic": 16,
            "shopping": 428,
            "restaurant": 3860,
            "transport": 74
        },
        "company": {
            "finance": 560,
            "retail": 4120,
            "realestate": 380,
            "tech": 780,
            "manufacturing": 2840,
            "tourism": 420,
            "logistics": 760
        },
        "tax": {
            "vat": 28.4,
            "corporate_income": 18.6,
            "consumption": 4.6,
            "personal_income": 10.2,
            "other": 3.8
        }
    },
    "370281": {
        "info": {"code": "370281", "name": "胶州市"},
        "yearly": [
            {"year": 2020, "gdp": 1180.4, "population": 880000},
            {"year": 2021, "gdp": 1268.6, "population": 896000},
            {"year": 2022, "gdp": 1368.2, "population": 912000},
            {"year": 2023, "gdp": 1478.4, "population": 928000},
            {"year": 2024, "gdp": 1602.6, "population": 944000},
            {"year": 2025, "gdp": 1746.8, "population": 960000},
        ],
        "poi": {
            "hospital": 28,
            "school": 134,
            "scenic": 14,
            "shopping": 368,
            "restaurant": 3240,
            "transport": 68
        },
        "company": {
            "finance": 480,
            "retail": 3560,
            "realestate": 320,
            "tech": 680,
            "manufacturing": 3120,
            "tourism": 280,
            "logistics": 1240
        },
        "tax": {
            "vat": 30.2,
            "corporate_income": 19.8,
            "consumption": 5.0,
            "personal_income": 11.4,
            "other": 4.2
        }
    },
    "370283": {
        "info": {"code": "370283", "name": "平度市"},
        "yearly": [
            {"year": 2020, "gdp": 890.6,  "population": 1350000},
            {"year": 2021, "gdp": 962.4,  "population": 1362000},
            {"year": 2022, "gdp": 1038.6, "population": 1374000},
            {"year": 2023, "gdp": 1124.8, "population": 1386000},
            {"year": 2024, "gdp": 1224.3, "population": 1398000},
            {"year": 2025, "gdp": 1338.6, "population": 1410000},
        ],
        "poi": {
            "hospital": 32,
            "school": 178,
            "scenic": 10,
            "shopping": 286,
            "restaurant": 2680,
            "transport": 56
        },
        "company": {
            "finance": 320,
            "retail": 2840,
            "realestate": 240,
            "tech": 380,
            "manufacturing": 2560,
            "tourism": 180,
            "logistics": 680
        },
        "tax": {
            "vat": 22.8,
            "corporate_income": 14.2,
            "consumption": 3.6,
            "personal_income": 8.4,
            "other": 3.0
        }
    },
    "370285": {
        "info": {"code": "370285", "name": "莱西市"},
        "yearly": [
            {"year": 2020, "gdp": 680.4,  "population": 760000},
            {"year": 2021, "gdp": 738.6,  "population": 771000},
            {"year": 2022, "gdp": 802.4,  "population": 782000},
            {"year": 2023, "gdp": 872.8,  "population": 793000},
            {"year": 2024, "gdp": 952.6,  "population": 804000},
            {"year": 2025, "gdp": 1042.4, "population": 815000},
        ],
        "poi": {
            "hospital": 22,
            "school": 112,
            "scenic": 8,
            "shopping": 198,
            "restaurant": 1860,
            "transport": 42
        },
        "company": {
            "finance": 240,
            "retail": 2120,
            "realestate": 180,
            "tech": 280,
            "manufacturing": 1860,
            "tourism": 140,
            "logistics": 480
        },
        "tax": {
            "vat": 16.4,
            "corporate_income": 10.8,
            "consumption": 2.6,
            "personal_income": 6.2,
            "other": 2.2
        }
    },
}


@router.get("/list")
async def get_districts():
    return [v["info"] for v in DISTRICT_DATA.values()]


@router.get("/{code}/stats")
async def get_district_stats(code: str):
    data = DISTRICT_DATA.get(code)
    if not data:
        raise HTTPException(status_code=404, detail=f"区划 {code} 不存在")
    return data