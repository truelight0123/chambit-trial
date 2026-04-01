const WEB_APP_URL = "여기에_앱스크립트_URL";

function getValue(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

document.addEventListener('DOMContentLoaded', () => {

  const form = document.getElementById('joinForm');
  const resultBox = document.getElementById('joinResult');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
      type: "join", // 🔥 이게 핵심 (상담과 구분)
      name: getValue('name'),
      phone: getValue('phone'),
      address: getValue('address'),
      ref: getValue('referralCode'),
      memo: getValue('memo')
    };

    if (!data.name) {
      alert("이름 입력");
      return;
    }

    if (!data.phone) {
      alert("연락처 입력");
      return;
    }

    try {
      const res = await fetch(WEB_APP_URL, {
        method: "POST",
        body: JSON.stringify(data)
      });

      const result = await res.json();

      if (result.success) {

        form.style.display = "none";

        resultBox.innerHTML = `
          <h3>가입 완료</h3>
          <p>회원번호: ${result.memberId}</p>
          <p>추천코드: ${result.refCode}</p>
          <p>추천링크:</p>
          <input value="${result.refLink}" style="width:100%" readonly>
        `;

      } else {
        alert("실패");
      }

    } catch (err) {
      alert("전송 오류");
    }

  });

});
