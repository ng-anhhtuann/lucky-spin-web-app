import React from "react";

// components

import Header from "public/shared/Header";
import Line from "public/shared/Line";
import BgBlueButton from "public/shared/BgBlueButton";
import EventButton from "public/shared/button/EventButton";
import BorderText from "public/shared/BorderText";
import { useRouter } from "next/router";

export default function Dashboard() {
  // navigate page

  const router = useRouter();
  const playNavigate = () => {
    router.push("/");
  };
  const createNavigate = () => {
    router.push("../event/eventregister");
  };
  const listNavigate = () => {
    router.push("../event/eventlist");
  };

  const event = [
    {
      id: "EV20221011",
      title: "tiệc cuối năm",
      user_joined: 10,
      status: 1,
    },
    {
      id: "EV20221012",
      title: "tiệc năm mới",
      user_joined: 20,
      status: 2,
    },
    {
      id: "EV20221013",
      title: "tiệc thành lập công ty trách nhiệm hữu hạn",
      user_joined: 30,
      status: 3,
    },
    {
      id: "EV20221014",
      title: "tiệc cuối năm",
      user_joined: 40,
      status: 4,
    },
  ];

  return (
    <>
      {/* header */}

      <Header />
      <section className="px-5 py-5 max-w-md w-screen mx-auto flex flex-col justify-center items-center">
        {/* participate in event */}

        <BorderText
          title={""}
          content={
            <div className=" flex flex-col pt-5">
              <p className="font-bold text-sm text-[#656565]">
                {"Chào mừng đến với AIT Lucky App,"}
              </p>
              <p className=" text-sm text-[#656565]">
                {"hãy bắt đầu các sự kiện ngay nào!"}
              </p>
              <div class="  w-full">
                <Line />
              </div>
              <p className="font-bold text-sm text-[#000000]">
                {"Tham gia sự kiện"}
              </p>
              <p className=" text-sm text-[#656565]">
                {
                  "Tham gia vào các sự kiện được tổ chức với tài khoản đăng nhập hiện tại của bạn."
                }
              </p>
              <BgBlueButton content={"CHƠI NÀO"} onClick={playNavigate} />
              <p className="font-bold text-sm text-[#000000] pb-2">
                {"Các sự kiện đang diễn ra"}
              </p>
              <div className="w-full flex flex-col gap-y-[7px] pb-5 ">
                {event.map((item) => {
                  return item.status === 2 ? (
                    <div className="flex flex-col">
                      <EventButton
                        key={item.id}
                        title={item.title}
                        user_joined={item.user_joined}
                        islink={true}
                        href={"_countdowncheckin"}
                      ></EventButton>
                    </div>
                  ) : (
                    <></>
                  );
                })}
              </div>
            </div>
          }
        ></BorderText>

        {/* create a event */}

        <BorderText
          title={"Tạo sự kiện"}
          content={
            <div className="">
              <p className=" text-sm text-[#656565] pt-5">
                {
                  "Tạo một sự kiện quay thưởng mới, bạn có thể thiết lập các giải thưởng, mỗi giải thưởng gồm tên, khái quát, hình ảnh giải thưởng, số lượng giải."
                }
              </p>
              <BgBlueButton content={"BẮT ĐẦU NGAY"} onClick={createNavigate} />
            </div>
          }
        ></BorderText>

        {/* show events */}

        <BorderText
          title={"Danh sách sự kiện"}
          content={
            <div className=" flex flex-col pt-5 gap-y-[7px]">
              {event.map((item) => {
                return (
                  <div className="flex flex-col">
                    <EventButton
                      key={item.id}
                      title={item.title}
                      user_joined={item.user_joined}
                      islink={true}
                      href={"_countdowncheckin"}
                    ></EventButton>
                  </div>
                );
              })}
              <BgBlueButton
                content={"DANH SÁCH SỰ KIỆN"}
                onClick={listNavigate}
              />
            </div>
          }
        ></BorderText>
      </section>
    </>
  );
}