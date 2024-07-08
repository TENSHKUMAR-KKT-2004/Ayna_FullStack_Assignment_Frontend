import React, { useState, useEffect } from "react"
import './chat.css'

const Chat = () => {

    const [selected, setSelected] = useState(false);

    useEffect(() => {
        const setSidebarHeight = () => {
            const sidebar = document.querySelector('.scrollable-section-1'); 
            const sidebar2 = document.querySelector('.scrollable-section-2');
            const viewportHeight = window.innerHeight;
            sidebar.style.height = `${viewportHeight}px`;
            sidebar2.style.height = `${viewportHeight}px`;
        };

        setSidebarHeight();

        window.addEventListener('load', setSidebarHeight);
        window.addEventListener('resize', setSidebarHeight);

        const ls = localStorage.getItem("selected");
        let selected = false;
        var list = document.querySelectorAll(".list"),
            content = document.querySelector(".content"),
            input = document.querySelector(".message-footer input"),
            open = document.querySelector(".open a");

        function init() {
            //input.focus();
            let now = 2;
            const texts = ["İyi akşamlar", "Merhaba, nasılsın?",
                "Harikasın! :)", "Günaydın", "Tünaydın",
                "Hahaha", "Öğlen görüşelim.", "Pekala"];
            for (var i = 4; i < list.length; i++) {
                list[i].querySelector(".time").innerText = `${now} day ago`;
                list[i].querySelector(".text").innerText = texts[(i - 4) < texts.length ? (i - 4) : Math.floor(Math.random() * texts.length)];
                now++;
            }
        }
        init();

        //list click
        function click(l, index) {
            list.forEach(x => { x.classList.remove("active"); });
            if (l) {
                l.classList.add("active");
                document.querySelector("sidebar").classList.remove("opened");
                open.innerText = "UP";
                const img = l.querySelector("img").src,
                    user = l.querySelector(".user").innerText,
                    time = l.querySelector(".time").innerText;

                content.querySelector("img").src = img;
                content.querySelector(".info .user").innerHTML = user;
                content.querySelector(".info .time").innerHTML = time;

                const inputPH = input.getAttribute("data-placeholder");
                input.placeholder = inputPH.replace("{0}", user.split(' ')[0]);

                document.querySelector(".message-wrap").scrollTop = document.querySelector(".message-wrap").scrollHeight;

                localStorage.setItem("selected", index);
            }
        }

        //process
        function process() {
            if (ls != null) {
                selected = true;
                click(list[ls], ls);
            }
            if (!selected) {
                click(list[0], 0);
            }

            list.forEach((l, i) => {
                l.addEventListener("click", function () {
                    click(l, i);
                });
            });

            try {
                document.querySelector(".list.active").scrollIntoView(true);
            }
            catch { }

        }
        process();

        return () => {
            window.removeEventListener('load', setSidebarHeight);
            window.removeEventListener('resize', setSidebarHeight);
            list.forEach((l, i) => {
                l.removeEventListener("click", () => click(l, i));
            });
        };
    }, []);

    const handleOpenClick = (e) => {
        const sidebar = document.querySelector("sidebar");
        sidebar.classList.toggle("opened");
        if (sidebar.classList.contains('opened')) {
            e.target.innerText = "DOWN";
        } else {
            e.target.innerText = "UP";
        }
    };

    return (
        <div className="container">
            <sidebar className="scrollable-section-1">
                <span className="logo">EchoChat</span>
                <div className="list-wrap scroll-container">
                    <div className="list">
                        <img src="https://www.cheatsheet.com/wp-content/uploads/2019/10/taylor-swift-1024x681.jpg" alt="" />
                        <div className="info">
                            <span className="user">Taylor Swift</span>
                            <span className="text">Hi! :)</span>
                        </div>
                        <span className="count">20</span>
                        <span className="time">now</span>
                    </div>
                    <div className="list">
                        <img src="https://www.billboard.com/files/media/miley-cyrus-vf-2-2018-billboard-1548.jpg" alt="" />
                        <div className="info">
                            <span className="user">Miley Cyrus</span>
                            <span className="text">Good night.</span>
                        </div>
                        <span className="time">5 min. ago</span>
                    </div>
                    <div className="list">
                        <img src="http://ia.tmgrup.com.tr/2fc58d/0/0/0/0/0/0?u=http://i.tmgrup.com.tr/cosmopolitan/galeri/unluler/isimleri-en-cok-aratilmis-dunyaca-unlu-50-kadin/10.jpg&mw=750" alt="" />
                        <div className="info">
                            <span className="user">Rihanna</span>
                            <span className="text">Çav bella</span>
                        </div>
                        <span className="time">1 hour ago</span>
                    </div>
                    <div className="list">
                        <img src="http://s3-eu-west-1.amazonaws.com/diy-magazine//diy/Artists/G/Girl-In-red/Girl-in-Red_-by-Chris-Almeida-1.png" width="50" height="50" alt="" />
                        <div className="info">
                            <span className="user">Furry</span>
                            <span className="text">Ok, lets go.</span>
                        </div>
                        <span className="time">1 day ago</span>
                    </div>
                    <div className="list">
                        <img src="data:image" alt="" />
                        <div className="info">
                            <span className="user">Cansu Dere</span>
                            <span className="text">Ok, lets go.</span>
                        </div>
                        <span className="time">1 day ago</span>
                    </div>
                    <div className="list">
                        <img src="data:image" alt="" />
                        <div className="info">
                            <span className="user">Demet Özdemir</span>
                            <span className="text">Hi! :)</span>
                        </div>
                        <span className="time">now</span>
                    </div>
                    <div className="list">
                        <img src="data:image" alt="" />
                        <div className="info">
                            <span className="user">Pelin Karahan</span>
                            <span className="text">Good night.</span>
                        </div>
                        <span className="time">5 min. ago</span>
                    </div>
                    <div className="list">
                        <img src="data:image" alt="" />
                        <div className="info">
                            <span className="user">Burçin Terzioğlu</span>
                            <span className="text">Çav bella</span>
                        </div>
                        <span className="time">1 hour ago</span>
                    </div>
                </div>
            </sidebar>
            <div className="content scrollable-section-2">
                <header>
                    <img src="" alt="" />
                    <div className="info">
                        <span className="user"></span>
                        <span className="time"></span>
                    </div>
                    <div className="open">
                        <a href="javascript:;" onClick={handleOpenClick}>UP</a>
                    </div>
                </header>
                <div className="message-wrap scroll-container">
                    <div className="message-list">
                        <div className="msg">
                            <p>
                                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Odit minus minima quo corporis.
                            </p>
                        </div>
                        <div className="time">now</div>
                    </div>
                    <div className="message-list me">
                        <div className="msg">
                            <p>
                                Lorem ipsum dolor sit amet.
                            </p>
                        </div>
                        <div className="time">now</div>
                    </div>
                    <div className="message-list">
                        <div className="msg">
                            <p>Odit minus minima quo corporis.
                            </p>
                        </div>
                        <div className="time">now</div>
                    </div>
                    <div className="message-list me">
                        <div className="msg">
                            <p>
                                Lorem.
                            </p>
                        </div>
                        <div className="time">now</div>
                    </div>
                    <div className="message-list">
                        <div className="msg">
                            <p>
                                Lorem, ipsum dolor.
                            </p>
                        </div>
                        <div className="time">now</div>
                    </div>
                    <div className="message-list me">
                        <div className="msg">
                            <p>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad numquam laudantium illum quidem? Iste hic doloribus quos non iure libero excepturi, praesentium in, blanditiis repellat labore illo, voluptas sed fugit consequatur dolorum assumenda ea nesciunt. Pariatur.
                            </p>
                        </div>
                        <div className="time">now</div>
                    </div>
                    <div className="message-list">
                        <div className="msg">
                            <p>
                                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Odit minus minima quo corporis.
                            </p>
                        </div>
                        <div className="time">now</div>
                    </div>
                    <div className="message-list me">
                        <div className="msg">
                            <p>
                                Lorem, ipsum.
                            </p>
                        </div>
                        <div className="time">now</div>
                    </div>
                    <div className="message-list">
                        <div className="msg">
                            <p>
                                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Maxime, nulla doloribus dolore impedit dolorem hic ex dolor quo illo tenetur ab exercitationem atque iusto, voluptatibus quos.
                            </p>
                        </div>
                        <div className="time">now</div>
                    </div>
                    <div className="message-list me">
                        <div className="msg">
                            <p>
                                Lorem dolor sit.
                            </p>
                        </div>
                        <div className="time">now</div>
                    </div>
                </div>
                <div className="message-footer">
                    <input type="text" data-placeholder="Send a message to {0}" />
                </div>
            </div>
        </div>
    )
}

export default Chat