// K-Culture Foreign Tourism Analytics Dashboard Logic
document.addEventListener('DOMContentLoaded', () => {
    // Chart.js Global Dark Theme Styling
    Chart.defaults.color = '#94a3b8';
    Chart.defaults.font.family = "'Inter', system-ui, sans-serif";
    Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(15, 23, 42, 0.9)';
    Chart.defaults.plugins.tooltip.borderColor = 'rgba(255, 255, 255, 0.15)';
    Chart.defaults.plugins.tooltip.borderWidth = 1;
    Chart.defaults.plugins.tooltip.padding = 10;
    Chart.defaults.plugins.tooltip.cornerRadius = 8;

    let chartCountryAge, chartBinaryFlags, chartGenderFlags, chartLoyalty;

    // 1. Initialize Chart 1: Country Age Gap Effect
    const ctxCountry = document.getElementById('chartCountryAge').getContext('2d');
    chartCountryAge = new Chart(ctxCountry, {
        type: 'bar',
        data: {
            labels: ['미국 (USA)', '중국 (China)', '일본 (Japan)', '대만 (Taiwan)', '전체 평균 (Global)'],
            datasets: [
                {
                    label: '일반 관광객 평균 연령 (세)',
                    data: [42.5, 39.8, 41.2, 38.5, 39.4],
                    backgroundColor: 'rgba(148, 163, 184, 0.4)',
                    borderColor: 'rgba(148, 163, 184, 0.8)',
                    borderWidth: 1,
                    borderRadius: 6
                },
                {
                    label: '한류 관여 관광객 평균 연령 (세)',
                    data: [33.6, 33.0, 36.0, 34.0, 36.3],
                    backgroundColor: 'rgba(168, 85, 247, 0.75)',
                    borderColor: '#a855f7',
                    borderWidth: 1,
                    borderRadius: 6
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top', labels: { boxWidth: 12, font: { size: 12 } } },
                tooltip: {
                    callbacks: {
                        afterBody: function(items) {
                            const diffs = [-8.9, -6.8, -5.2, -4.5, -3.1];
                            const idx = items[0].dataIndex;
                            return `\n▶ 연령 하향 격차: ${diffs[idx]} 세 어림`;
                        }
                    }
                }
            },
            scales: {
                x: { grid: { display: false } },
                y: { min: 25, max: 48, grid: { color: 'rgba(255, 255, 255, 0.05)' } }
            }
        }
    });

    // 2. Initialize Chart 2: Binary Flags Penetration Rate
    const ctxBinary = document.getElementById('chartBinaryFlags').getContext('2d');
    chartBinaryFlags = new Chart(ctxBinary, {
        type: 'bar',
        indexAxis: 'y',
        data: {
            labels: [
                '식도락 활동 (FLAG_ACT_FOOD)',
                '화장품/향수 쇼핑 (FLAG_SHOP_COSMETIC)',
                'K-컬처 통합활동 (FLAG_ACT_K)',
                '의류/패션 쇼핑 (FLAG_SHOP_FASHION)',
                'K-POP/공연 활동 (FLAG_ACT_KPOP)',
                'SNS 정보습득 (FLAG_INFO_SNS)',
                'K-컬처 방문이유 (FLAG_REASON_K)',
                '뷰티/미용 체험 (FLAG_ACT_BEAUTY)',
                '한류 전용 굿즈 (FLAG_SHOP_HALLYU)'
            ],
            datasets: [{
                label: '선택 비율 (%)',
                data: [80.2, 57.5, 41.1, 38.7, 36.7, 35.7, 23.0, 5.7, 2.4],
                backgroundColor: [
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(6, 182, 212, 0.8)',
                    'rgba(168, 85, 247, 0.8)',
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(244, 63, 94, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(168, 85, 247, 0.6)',
                    'rgba(244, 63, 94, 0.6)',
                    'rgba(6, 182, 212, 0.6)'
                ],
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: { max: 100, grid: { color: 'rgba(255, 255, 255, 0.05)' } },
                y: { grid: { display: false } }
            }
        }
    });

    // 3. Initialize Chart 3: Gender Flags Comparison
    const ctxGender = document.getElementById('chartGenderFlags').getContext('2d');
    chartGenderFlags = new Chart(ctxGender, {
        type: 'bar',
        data: {
            labels: ['화장품 쇼핑', 'SNS 정보습득', '의류/패션 쇼핑', '식도락 활동', 'K-컬처 방문이유'],
            datasets: [
                {
                    label: '여성 관광객 (Female)',
                    data: [68.4, 42.0, 43.0, 83.5, 24.9],
                    backgroundColor: 'rgba(244, 63, 94, 0.75)',
                    borderColor: '#f43f5e',
                    borderWidth: 1,
                    borderRadius: 6
                },
                {
                    label: '남성 관광객 (Male)',
                    data: [43.0, 27.4, 32.9, 75.8, 20.5],
                    backgroundColor: 'rgba(59, 130, 246, 0.65)',
                    borderColor: '#3b82f6',
                    borderWidth: 1,
                    borderRadius: 6
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top', labels: { boxWidth: 12, font: { size: 12 } } }
            },
            scales: {
                x: { grid: { display: false } },
                y: { max: 100, grid: { color: 'rgba(255, 255, 255, 0.05)' } }
            }
        }
    });

    // 4. Initialize Chart 4: Loyalty by K-Culture Group
    const ctxLoyalty = document.getElementById('chartLoyalty').getContext('2d');
    chartLoyalty = new Chart(ctxLoyalty, {
        type: 'bar',
        data: {
            labels: ['Medium (K-컬처 향유형)', 'High (K-컬처 주도형)', 'Low (일반/비즈니스형)'],
            datasets: [
                {
                    label: '추천 의향 평균 (5점)',
                    data: [4.60, 4.54, 4.48],
                    backgroundColor: 'rgba(16, 185, 129, 0.75)',
                    borderColor: '#10b981',
                    borderWidth: 1,
                    borderRadius: 6
                },
                {
                    label: '재방문 의향 평균 (5점)',
                    data: [4.53, 4.47, 4.45],
                    backgroundColor: 'rgba(6, 182, 212, 0.75)',
                    borderColor: '#06b6d4',
                    borderWidth: 1,
                    borderRadius: 6
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top', labels: { boxWidth: 12, font: { size: 12 } } }
            },
            scales: {
                x: { grid: { display: false } },
                y: { min: 4.0, max: 4.8, grid: { color: 'rgba(255, 255, 255, 0.05)' } }
            }
        }
    });

    // Tab Switching Logic
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            const targetId = btn.getAttribute('data-tab');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // Dynamic Filter Change Logic
    const filterYear = document.getElementById('filterYear');
    const filterGender = document.getElementById('filterGender');
    const filterAge = document.getElementById('filterAge');
    const filterGroup = document.getElementById('filterGroup');
    const btnResetFilter = document.getElementById('btnResetFilter');

    function updateDashboard() {
        const yearVal = filterYear.value;
        const genderVal = filterGender.value;
        const ageVal = filterAge.value;
        const groupVal = filterGroup.value;

        // Dynamic KPI adjustments based on filters
        let sampleCount = 64598;
        let ageGap = -3.1;
        let femaleRatio = 68.2;

        if (yearVal === '2024') {
            sampleCount = 16216;
            ageGap = -3.4;
        } else if (yearVal === '2019') {
            sampleCount = 16076;
            ageGap = -2.8;
        }

        if (genderVal === 'female') {
            femaleRatio = 100.0;
            ageGap = -3.6;
        } else if (genderVal === 'male') {
            femaleRatio = 0.0;
            ageGap = -2.3;
        }

        if (ageVal === 'young') {
            ageGap = -4.2;
        }

        document.getElementById('kpiSampleCount').textContent = sampleCount.toLocaleString();
        document.getElementById('kpiAgeGap').textContent = ageGap.toFixed(1);
        document.getElementById('kpiFemaleRatio').textContent = femaleRatio.toFixed(1);
    }

    [filterYear, filterGender, filterAge, filterGroup].forEach(el => {
        el.addEventListener('change', updateDashboard);
    });

    btnResetFilter.addEventListener('click', () => {
        filterYear.value = 'all';
        filterGender.value = 'all';
        filterAge.value = 'all';
        filterGroup.value = 'all';
        updateDashboard();
    });
});
