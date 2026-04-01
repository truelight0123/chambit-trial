const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbw6qHnoEaDcgMP4E21ZlcDlFE6fkC38zp2Rqh2ebc-GhPioiRAIi0VGhlwEno26OgJ8/exec";

function getValue(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

function formatPhoneInput(input) {
  const num = input.value.replace(/\D/g, '').slice(0, 11);

  if (num.length <= 3) {
    input.value = num;
  } else if (num.length <= 7) {
    input.value = num.slice(0, 3) + '-' + num.slice(3);
  } else {
    input.value =
      num.slice(0, 3) + '-' +
      num.slice(3, 7) + '-' +
      num.slice(7);
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('joinForm');
  const phoneInput = document.getElementById('phone');
  const referralCodeInput = document.getElementById('referralCode');

  const submitBtn = document.getElementById('joinSubmitBtn');
  const submitText = document.getElementById('joinSubmitText');
  const submitLoading = document.getElementById('joinSubmitLoading');

  const resultBox = document.getElementById('joinResult');
  const resultMemberId = document.getElementById('resultMemberId');
  const resultRefCode = document.getElementById('resultRefCode');
  const resultRefLink = document.getElementById('resultRefLink');
  const copyRefLinkBtn = document.getElementById('copyRefLinkBtn');

  const urlParams = new URLSearchParams(window.location.search);
  const refFromUrl = (urlParams.get('ref') || '').trim();

  if (refFromUrl) {
    localStorage.setItem('chambit_ref_code', refFromUrl);
  }

  const savedRef = localStorage.getItem('chambit_ref_code') || '';
  const finalRef = refFromUrl || savedRef;

  if (finalRef && referralCodeInput) {
    referralCodeInput.value = finalRef;
  }

  if (phoneInput) {
    phoneInput.addEventListener('input', function () {
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

  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const data = {
      type: 'join',
      name: getValue('name'),
      phone: getValue('phone'),
      address: getValue('address'),
      ref: getValue('referralCode'),
      memo: getValue('memo')
    };

    if (!data.name) {
      alert('이름을 입력하세요.');
      return;
    }

    if (!data.phone) {
      alert('연락처를 입력하세요.');
      return;
    }

    try {
      submitBtn.disabled = true;
      submitText.style.display = 'none';
      submitLoading.style.display = 'inline-flex';

      const res = await fetch(WEB_APP_URL, {
        method: 'POST',
        body: JSON.stringify(data)
      });

      const result = await res.json();

      if (result.success) {
        form.style.display = 'none';
        resultBox.style.display = 'block';

        resultMemberId.textContent = result.memberId || '-';
        resultRefCode.textContent = result.refCode || '-';
        resultRefLink.value = result.refLink || '';
      } else {
        alert(result.message || '회원가입 처리 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error(error);
      alert('전송 오류가 발생했습니다.');
    } finally {
      submitBtn.disabled = false;
      submitText.style.display = 'inline-flex';
      submitLoading.style.display = 'none';
    }
  });

  if (copyRefLinkBtn) {
    copyRefLinkBtn.addEventListener('click', async function () {
      if (!resultRefLink.value) return;

      try {
        await navigator.clipboard.writeText(resultRefLink.value);
        alert('추천링크가 복사되었습니다.');
      } catch (error) {
        alert('복사에 실패했습니다.');
      }
    });
  }
});
