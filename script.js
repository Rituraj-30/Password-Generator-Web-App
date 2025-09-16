  const inputslider = document.querySelector("[data-len-slider]");
    const lengthDisplay = document.querySelector("[data-len-number]");
    const passwordDisplay = document.querySelector("[data-password-Display]");
    const copybtn = document.querySelector("[data-cpy-btn]");
    const copy_msg = document.querySelector("[data-copymsg]");
    const uppercaseCheck = document.querySelector("#uppercase");
    const lowercaseCheck = document.querySelector("#lowercase");
    const numbercaseCheck = document.querySelector("#numbers");
    const symbolCheck = document.querySelector("#symbols");
    const indicatorText = document.querySelector("[data-indicator-text]");
    const indicatorColor = document.querySelector("[data-indicator-color]");
    const generatebtn = document.querySelector(".Generate");
    const allcheckbox = document.querySelectorAll("input[type=checkbox]");
    const symbol = '!~@#$%^&*()_+={}[]<>,./?;:|';

    let password = "";
    let passwordlength = 10;
    let checkCount = 0;

    handleSlider();
    setIndicator("#ccc", "");

    function handleSlider() {
      inputslider.value = passwordlength;
      lengthDisplay.innerText = passwordlength;
      const min = inputslider.min;
      const max = inputslider.max;
      inputslider.style.backgroundSize =
        ((passwordlength - min) * 100 / (max - min)) + "% 100%";
    }

    function setIndicator(color, text) {
      indicatorColor.style.backgroundColor = color;
     indicatorColor.style.boxShadow = `0px 0px 12px 1px ${color}`;
      indicatorText.textContent = text;
    }

    function getRndnumber(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    }

    function generateRandomnumber() {
      return getRndnumber(0, 9);
    }

    function generatelowerCase() {
      return String.fromCharCode(getRndnumber(97, 123));
    }

    function generateupperCase() {
      return String.fromCharCode(getRndnumber(65, 91));
    }

    function generateSymbols() {
      const radNum = getRndnumber(0, symbol.length);
      return symbol.charAt(radNum);
    }

    function calcStrength() {
      let hasUpper = uppercaseCheck.checked;
      let hasLower = lowercaseCheck.checked;
      let hasNumber = numbercaseCheck.checked;
      let hasSymbol = symbolCheck.checked;

      if (hasUpper && hasLower && (hasNumber || hasSymbol) && passwordlength >= 8) {
        setIndicator("limegreen", "Strong");
      } else if ((hasLower || hasUpper) && (hasNumber || hasSymbol) && passwordlength >= 6) {
        setIndicator("yellow", "Medium");
      } else {
        setIndicator("red", "Weak");
      }
    }

    async function copycontent() {
      try {
        await navigator.clipboard.writeText(passwordDisplay.value);
      } catch (e) {
        console.error("Copy failed:", e);
      }
      const copyIcon = document.querySelector(".copy-icon");
      copyIcon.classList.add("hide");
      copy_msg.classList.add("active");
      setTimeout(() => {
        copy_msg.classList.remove("active");
        copyIcon.classList.remove("hide");
      }, 2000);
    }

    function shufflePassword(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array.join("");
    }

    function handleCheckBoxChange() {
      checkCount = 0;
      allcheckbox.forEach((checkbox) => {
        if (checkbox.checked) checkCount++;
      });
      if (passwordlength < checkCount) {
        passwordlength = checkCount;
        handleSlider();
      }
    }

    allcheckbox.forEach((checkbox) => {
      checkbox.addEventListener('change', handleCheckBoxChange);
    });

    inputslider.addEventListener('input', (e) => {
      passwordlength = e.target.value;
      handleSlider();
    });

    copybtn.addEventListener('click', () => {
      if (passwordDisplay.value) {
        copycontent();
      }
    });

    generatebtn.addEventListener('click', () => {
      if (checkCount <= 0) return;
      if (passwordlength < checkCount) {
        passwordlength = checkCount;
        handleSlider();
      }
      password = "";
      let funcArr = [];
      if (uppercaseCheck.checked) funcArr.push(generateupperCase);
      if (lowercaseCheck.checked) funcArr.push(generatelowerCase);
      if (numbercaseCheck.checked) funcArr.push(generateRandomnumber);
      if (symbolCheck.checked) funcArr.push(generateSymbols);

      for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
      }
      for (let i = 0; i < passwordlength - funcArr.length; i++) {
        let randidx = getRndnumber(0, funcArr.length);
        password += funcArr[randidx]();
      }
      password = shufflePassword(Array.from(password));
      passwordDisplay.value = password;
      calcStrength();
    });