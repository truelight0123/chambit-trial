/* =============================================
   참빛 미네랄 수소수기 - main.js
   현재 단계:
   - 상담신청 유지
   - 회원가입 버튼/화면 분리
   - 추천코드 URL 반영
   ============================================= */

const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbw6qHnoEaDcgMP4E21ZlcDlFE6fkC38zp2Rqh2ebc-GhPioiRAIi0VGhlwEno26OgJ8/exec";

/* ===== 공통 ===== */
function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

function getValue(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

/* ===== DOM 로딩 후 ===== */
window.addEventListener('DOMContentLoaded', function () {
  const ref = (getQueryParam('ref') || '').trim();

  // 추천코드 저장
// URL에서 추천코드 가져오기
const params = new URLSearchParams(window.location.search);
const ref = (params.get('ref') || '').trim();

// 기존 저장된 추천코드 제거
localStorage.removeItem('chambit_ref_code');

// 최종 추천코드
const finalRef = ref;

// 회원가입 링크 처리
const joinLinks = document.querySelectorAll('a[href="join.html"]');

joinLinks.forEach(function(link) {
  if (finalRef) {
    link.href = 'join.html?ref=' + encodeURIComponent(finalRef);
  } else {
    link.href = 'join.html';
  }
});

// 추천코드 입력창 & 표시
const refInput = document.getElementById('referralCode');
const refDisplay = document.getElementById('refCodeDisplay');

if (refInput) {
  refInput.value = finalRef;
}

if (refDisplay) {
  refDisplay.textContent = finalRef || '';
  refDisplay.style.display = finalRef ? 'block' : 'none';
}

  /* 전화번호 자동 포맷 */
  const phone = document.getElementById('phone');
  if (phone) {
    phone.addEventListener('input', function () {
      const num = this.value.replace(/\D/g, '').slice(0, 11);

      if (num.length <= 3) {
        this.value = num;
      } else if (num.length <= 7) {
        this.value = num.slice(0, 3) + '-' + num.slice(3);
      } else {
        this.value =
          num.slice(0, 3) + '-' +
          num.slice(3, 7) + '-' +
          num.slice(7);
      }
    });
  }

  /* 모바일 메뉴 */
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', function () {
      mobileMenu.classList.toggle('open');
    });

    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileMenu.classList.remove('open');
      });
    });
  }

  /* 헤더 스크롤 */
  const header = document.getElementById('siteHeader');
  if (header) {
    const updateHeader = function () {
      if (window.scrollY > 10) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };

    updateHeader();
    window.addEventListener('scroll', updateHeader);
  }
});

/* ===== 상담 신청 폼 제출 ===== */
const form = document.getElementById('consultationForm');
const btn = document.getElementById('submitBtn');
const btnText = document.getElementById('submitBtnText');
const btnLoading = document.getElementById('submitBtnLoading');
const successBox = document.getElementById('formSuccess');
const resetBtn = document.getElementById('formResetBtn');

if (form) {
  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const data = {
      name: getValue('name'),
      phone: getValue('phone'),
      email: '',
      region: getValue('region'),
      storeType: getValue('consultType'),
      installTarget: getValue('installTarget'),
      purpose: getValue('purpose'),
      ref: getValue('referralCode'),
      message: ''
    };

    if (!data.name) {
      alert('이름을 입력하세요');
      return;
    }

    if (!data.phone) {
      alert('연락처를 입력하세요');
      return;
    }

    if (!data.storeType) {
      alert('상담 유형을 선택하세요');
      return;
    }

    try {
      if (btn) btn.disabled = true;
      if (btnText) btnText.style.display = 'none';
      if (btnLoading) btnLoading.style.display = 'inline-flex';

      const res = await fetch(WEB_APP_URL, {
        method: 'POST',
        body: JSON.stringify(data)
      });

      const result = await res.json();

      if (result.success) {
        form.style.display = 'none';
        if (successBox) successBox.style.display = 'block';
      } else {
        alert(result.message || '오류 발생');
      }
    } catch (err) {
      console.error(err);
      alert('전송 실패');
    } finally {
      if (btn) btn.disabled = false;
      if (btnText) btnText.style.display = 'inline-flex';
      if (btnLoading) btnLoading.style.display = 'none';
    }
  });
}

/* ===== 폼 초기화 ===== */
if (resetBtn) {
  resetBtn.addEventListener('click', function () {
    form.reset();

    const ref = (getQueryParam('ref') || '').trim();
    const referralCode = document.getElementById('referralCode');
    const refCodeDisplay = document.getElementById('refCodeDisplay');

    if (referralCode) referralCode.value = ref;
    if (refCodeDisplay) refCodeDisplay.textContent = ref || '없음';

    form.style.display = 'block';
    if (successBox) successBox.style.display = 'none';
  });
}

/* ===== 상단 이동 버튼 ===== */
const scrollBtn = document.getElementById('scrollTopBtn');
if (scrollBtn) {
  window.addEventListener('scroll', function () {
    scrollBtn.classList.toggle('visible', window.scrollY > 300);
  });

  scrollBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
