# 🚴 서울시 따릉이 대여소 이용 현황 대시보드

서울시 따릉이 대여소별 시간대별 이용 데이터 (`data/bike_station_hourly.csv`)를 기반으로 **총 이용건수** 및 **운영 대여소 수**를 집계하고 시각화하는 인터랙티브 웹 대시보드입니다.

---

## 📊 주요 핵심 지표 (Core KPIs)

* 🚴 **총 이용건수 (Total Usage)**: **41,649,637 건** (전체 대여소 누적 대여량)
* 🚉 **운영 대여소 수 (Active Stations)**: **2,824 개소** (서울시 내 활성 대여소 수)
* 🧮 **대여소당 평균 이용건수**: **14,748 건/소**
* ⏰ **최다 이용 피크 시간**: **18시** (퇴근길 이용 집중)

---

## 📁 주요 파일 구성

* `index.html`: 메인 대시보드 웹 애플리케이션 레이아웃 및 KPI 카드
* `style.css`: 글래스모피즘 기반 다크 스타일 테마 디자인
* `app.js`: CSV 파싱, 데이터 집계, 숫자 카운터 애니메이션 & Chart.js 시각화
* `serve.ps1`: 로컬 개발용 웹서버 실행 스크립트
* `data/bike_station_hourly.csv`: 원본 분석 데이터셋

---

## 🚀 대시보드 실행 방법

### 방법 1: PowerShell 웹서버 실행
```powershell
powershell -ExecutionPolicy Bypass -File serve.ps1
```
웹서버 실행 후 브라우저에서 `http://localhost:8085`에 접속합니다.

### 방법 2: Live Server / HTTP Server 이용
VS Code의 `Live Server` 확장 또는 Python/Node http-server를 실행하여 `index.html`을 로드합니다.
