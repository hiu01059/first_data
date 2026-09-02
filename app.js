// State Management
let rawData = [];
let hourlyChartInstance = null;
let currentFilter = 'all';

// DOM Elements
const loadingOverlay = document.getElementById('loadingOverlay');
const progressBar = document.getElementById('progressBar');
const loadingText = document.getElementById('loadingText');

const totalUsageEl = document.getElementById('totalUsage');
const activeStationsEl = document.getElementById('activeStations');
const avgUsagePerStationEl = document.getElementById('avgUsagePerStation');
const peakHourEl = document.getElementById('peakHour');
const peakHourVolumeEl = document.getElementById('peakHourVolume');
const topStationsListEl = document.getElementById('topStationsList');
const kpiUsageDescEl = document.getElementById('kpiUsageDesc');

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    initFilterButtons();
    loadCSVData();
});

// Setup Filter Event Listeners
function initFilterButtons() {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            
            // Update UI description
            if (currentFilter === 'all') {
                kpiUsageDescEl.textContent = '전체 대여소에서 발생한 누적 이용 총합';
            } else if (currentFilter === '평일') {
                kpiUsageDescEl.textContent = '평일 기준 대여소 누적 이용 총합';
            } else if (currentFilter === '주말') {
                kpiUsageDescEl.textContent = '주말 기준 대여소 누적 이용 총합';
            }

            processAndUpdateDashboard();
        });
    });
}

// Load CSV File using PapaParse
function loadCSVData() {
    const primaryUrl = 'data/bike_station_hourly.csv';
    const fallbackUrl = '05주차_데이터셋/data/bike_station_hourly.csv';
    
    function tryParse(url, isFallback = false) {
        Papa.parse(url, {
            download: true,
            header: true,
            skipEmptyLines: true,
            chunk: function(results, parser) {
                rawData = rawData.concat(results.data);
                if (rawData.length % 20000 === 0) {
                    const estProgress = Math.min(95, Math.floor((rawData.length / 134180) * 100));
                    progressBar.style.width = `${estProgress}%`;
                    loadingText.textContent = `${rawData.length.toLocaleString()}개 데이터 처리 중...`;
                }
            },
            complete: function() {
                progressBar.style.width = '100%';
                loadingText.textContent = '대시보드 화면 생성 완료!';
                setTimeout(() => {
                    loadingOverlay.classList.add('hidden');
                    processAndUpdateDashboard();
                }, 300);
            },
            error: function(err) {
                console.warn(`CSV Load Error from ${url}:`, err);
                if (!isFallback) {
                    rawData = [];
                    tryParse(fallbackUrl, true);
                } else {
                    loadingText.textContent = '데이터를 불러오는 중 오류가 발생했습니다.';
                }
            }
        });
    }

    tryParse(primaryUrl);
}

// Main Data Aggregation & UI Update Logic
function processAndUpdateDashboard() {
    // 1. Filter Data
    const filtered = currentFilter === 'all' 
        ? rawData 
        : rawData.filter(row => row['요일유형'] === currentFilter);

    // 2. Aggregate Primary Metrics
    let totalUsage = 0;
    const activeStationsSet = new Set();
    const hourlySum = Array(24).fill(0);
    const stationMap = {};

    for (let i = 0; i < filtered.length; i++) {
        const row = filtered[i];
        const count = parseInt(row['이용건수'], 10) || 0;
        const hour = parseInt(row['대여시간'], 10) || 0;
        const stationName = row['대여소명'] || row['대여소번호'];
        const stationId = row['대여소번호'];

        totalUsage += count;
        
        if (stationId) {
            activeStationsSet.add(stationId);
        }

        if (hour >= 0 && hour < 24) {
            hourlySum[hour] += count;
        }

        if (stationName) {
            stationMap[stationName] = (stationMap[stationName] || 0) + count;
        }
    }

    const activeStationsCount = activeStationsSet.size;
    const avgUsagePerStation = activeStationsCount > 0 ? Math.round(totalUsage / activeStationsCount) : 0;

    // Peak Hour calculation
    let maxHour = 0;
    let maxHourVal = 0;
    for (let h = 0; h < 24; h++) {
        if (hourlySum[h] > maxHourVal) {
            maxHourVal = hourlySum[h];
            maxHour = h;
        }
    }

    // 3. Update KPI Cards with Counter Animation
    animateCounter(totalUsageEl, totalUsage);
    animateCounter(activeStationsEl, activeStationsCount);
    animateCounter(avgUsagePerStationEl, avgUsagePerStation);
    animateCounter(peakHourEl, maxHour);
    
    if (peakHourVolumeEl) {
        peakHourVolumeEl.textContent = `피크시간 이용량: ${maxHourVal.toLocaleString()}건`;
    }

    // 4. Update Top 5 Stations Ranking
    const sortedStations = Object.entries(stationMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    renderTopStations(sortedStations);

    // 5. Update 24H Hourly Chart
    renderHourlyChart(hourlySum);
}

// Smooth Number Counter Animation
function animateCounter(element, targetValue) {
    const startValue = parseInt(element.textContent.replace(/,/g, ''), 10) || 0;
    if (startValue === targetValue) return;

    const duration = 800; // ms
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // EaseOutCubic function
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.floor(startValue + (targetValue - startValue) * easeProgress);

        element.textContent = currentValue.toLocaleString();

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = targetValue.toLocaleString();
        }
    }

    requestAnimationFrame(update);
}

// Render Top 5 Stations List
function renderTopStations(stations) {
    topStationsListEl.innerHTML = '';
    
    stations.forEach(([name, count], index) => {
        const li = document.createElement('li');
        li.className = `ranking-item rank-${index + 1}`;
        
        li.innerHTML = `
            <div class="rank-info">
                <div class="rank-number">${index + 1}</div>
                <div class="rank-name" title="${name}">${name}</div>
            </div>
            <div class="rank-count">${count.toLocaleString()}건</div>
        `;
        topStationsListEl.appendChild(li);
    });
}

// Render or Update Chart.js Hourly Trend
function renderHourlyChart(hourlyData) {
    const ctx = document.getElementById('hourlyChart').getContext('2d');

    const labels = Array.from({ length: 24 }, (_, i) => `${i}시`);

    if (hourlyChartInstance) {
        hourlyChartInstance.data.datasets[0].data = hourlyData;
        hourlyChartInstance.update();
        return;
    }

    // Create Gradient Fill
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(6, 182, 212, 0.45)');
    gradient.addColorStop(1, 'rgba(6, 182, 212, 0.0)');

    hourlyChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: '총 이용건수',
                data: hourlyData,
                borderColor: '#06b6d4',
                borderWidth: 3,
                backgroundColor: gradient,
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 7,
                pointBackgroundColor: '#06b6d4',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    titleFont: { size: 14, weight: 'bold' },
                    bodyFont: { size: 13 },
                    padding: 12,
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderWidth: 1,
                    callbacks: {
                        label: function(context) {
                            return ` 이용건수: ${context.parsed.y.toLocaleString()}건`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { color: '#94a3b8', font: { size: 11 } }
                },
                y: {
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { 
                        color: '#94a3b8', 
                        font: { size: 11 },
                        callback: function(value) {
                            if (value >= 10000) return (value / 10000).toFixed(0) + '만';
                            return value;
                        }
                    }
                }
            }
        }
    });
}
