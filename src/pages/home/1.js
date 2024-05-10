class FlipClock {
    main;
    nums;
    divs;
    constructor(el) {
        this.main = document.querySelector(el);
    }
    render() {
        this.clock();
        setInterval(() => {
            this.getTimes();
            this.updataDivNumber();
        }, 1000); // 每秒更新一次
    }
    //更新
             div.textContent = num;
                }
            });
        });
    }
    clock() {
        this.getTimes();
        this.createSectionElement();
        this.getDivs();
    }
      
    getDivs() {
        this.divs = Array.from(this.main.querySelectorAll('section')).map((section) =>
            section.querySelectorAll('div')
        );
    }
    //当前时间
    getTimes() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        this.nums = [hours[0], hours[1], minutes[0], minutes[1], seconds[0], seconds[1]];
    }

    createSectionElement() {
        this.main.innerHTML = ''; 
        this.nums.forEach((num, index) => {
            this.main.insertAdjacentHTML(
                'beforeend',
                `
            <section>
            <div data-before="${num}" data-after="4"></div>
            <div data-before="${num}" data-after="4"></div>
        </section>
            `
            );
            if (index % 2 && index !== this.nums.length - 1) {
                this.main.insertAdjacentHTML('beforeend', '<p></p>');
            }
        });
    }
}
const instance = new FlipClock('#hd');
instance.render(); // 调用 render 方法来启动时钟