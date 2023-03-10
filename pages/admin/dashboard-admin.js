import React, { useState, useEffect, useMemo } from "react";
import router from "next/router";
// firebase
import { db } from "src/firebase";
import { ref, query, onValue, orderByValue } from "firebase/database";
// redux
import { useDispatch } from "react-redux";
import { useUserPackageHook } from "public/redux/hooks";
import { userCurrentEventHosting } from "public/redux/actions";
// components
import { Header, Input, Line, Button } from "public/shared";
import EventButton from "public/shared/button/EventButton";
import { LEFT_COLOR, RIGHT_COLOR } from "public/util/colors";
// translation
import Trans from "public/trans/hooks/Trans";
//gif
import nyancat from "public/img/nyancat.gif";
export default function Dashboard() {
  const [arrStatus, setArrStatus] = useState([]);
  const [arrID, setArrID] = useState([]);
  const dispatch = useDispatch();
  const currentUser = useUserPackageHook();
  // create query
  const queDb = query(ref(db, "event"), orderByValue("createAt"));
  // authentication, only users can access this page
  const checkAuth = () => {
    router.push("/auth/login");
  };
  // translation
  const trans = Trans();
  // get(child(ref(db), `event`))
  // .then((snapshot) => {
  //   const res = snapshot.val() ?? [];
  //   const values = Object.values(res);
  //   setArr(values);
  // })
  // .catch((error) => {
  //   alert(error.message);
  //   console.error(error);
  // });
  // useEffect(() => {
  //   onValue(child(ref(db), "event/"), (snapshot) => {
  //     const record = snapshot.val() ?? [];
  //     const values = Object.values(record);
  //     values.forEach((value) => {
  //       if (value.status === 2) {
  //         setQueryStatus((prev) => [...prev, value]);
  //         console.log(value);
  //       }
  //     });
  //     console.log(queryStatus);
  //   });
  // }, []);
  useEffect(() => {
    onValue(queDb, (snapshot) => {
      setArrStatus([]);
      const data = snapshot.val();
      if (data != null) {
        const values = Object.values(data);
        values.forEach((value) => {
          if (
            value.delFlag === false &&
            (value.status === 1 || value.status === 2 || value.status === 3) &&
            value.createBy === currentUser.userId
          )
            setArrStatus((prev) => [...prev, value]);
        });
      }
    });
  }, []);
  useEffect(() => {
    onValue(queDb, (snapshot) => {
      setArrID([]);
      const data = snapshot.val();
      if (data != null) {
        const values = Object.values(data);
        values.forEach((value) => {
          if (value.delFlag === false && value.createBy === currentUser.userId)
            setArrID((prev) => [...prev, value]);
        });
      }
    });
  }, [String(currentUser.userId)]);
  //render view
  const renderHeader = useMemo(() => {
    return <Header />;
  }, []);
  const renderWelcome = useMemo(() => {
    return (
      <div className="flex flex-col pb-4 pt-2">
        <div className="flex flex-col">
          <div className="flex justify-between items-end w-full">
            <div className="flex flex-col flex-1">
              <p className="font-bold text-sm text-[#656565] mt-2">
                {trans.dashboard.welcome.title}
              </p>
              <p className="text-sm text-[#656565] mb-2">
                {trans.dashboard.welcome.content}
              </p>
            </div>
            <img
              src={nyancat}
              className="w-1/5 min-h-min "
              alt="must be a nyancat gif"
            ></img>
          </div>
        </div>
        <div className="w-full mb-2">
          <Line marginY={false} />
        </div>
      </div>
    );
  }, []);
  const renderJoinEvent = useMemo(() => {
    return (
      <Input content={trans.dashboard.joinEvent.title}>
        <div className="flex flex-col pb-4 pt-2">
          <p className=" f text-sm text-[#656565] my-2">
            {trans.dashboard.joinEvent.description}
          </p>
          <div onClick={() => {router.push("/")}}>
            <Button
              margin={"my-0"}
              content={trans.dashboard.joinEvent.buttonContent}
              primaryColor={LEFT_COLOR}
              secondaryColor={RIGHT_COLOR}
            />
          </div>
        </div>
      </Input>
    );
  }, []);
  const renderShowCurrentEvent = useMemo(() => {
    return (
      <Input
        content={trans.dashboard.showCurrentEvent.title}
        isTextGradient={true}
      >
        <div className="flex flex-col py-4">
          <p className=" text-sm text-[#656565] mb-2">
            {trans.dashboard.showCurrentEvent.description}
          </p>
          <div className="w-full flex flex-col gap-y-[7px] overflow-auto max-h-[188px] scrollbar-hide">
            {arrStatus.length === 0 ? (
              <div className="w-full flex items-center text-center justify-center text-sm text-[#000000]">
                {" "}
                {trans.dashboard.showCurrentEvent.checklength}
              </div>
            ) : (
              arrStatus.map((item, index) => (
                <div key={index} className="flex flex-col">
                  <EventButton
                    title={item.title}
                    id={item.eventId}
                    userJoined={item.userJoined}
                    status={item.status}
                    db={1}
                    onclick={() => dispatch(userCurrentEventHosting(item))}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </Input>
    );
  }, [arrStatus]);
  const renderCreateEvent = useMemo(() => {
    return (
      <Input content={trans.dashboard.createEvent.title} isTextGradient={true}>
        <div className="">
          <p className="text-sm text-[#656565] pt-4">
            {trans.dashboard.createEvent.description}
          </p>
          <div onClick={() => {router.push("/admin/event/event-register")}}>
            <Button
              content={trans.dashboard.createEvent.buttonContent}
              primaryColor={LEFT_COLOR}
              secondaryColor={RIGHT_COLOR}
            />
          </div>
        </div>
      </Input>
    );
  }, []);
  const renderShowCreateEvent = useMemo(() => {
    return (
      <Input
        content={trans.dashboard.showCreateEvent.title}
        isTextGradient={true}
      >
        <p className=" text-sm text-[#656565] mt-4 mb-2">
          {trans.dashboard.showCreateEvent.description}
        </p>
        <div className="flex flex-col gap-y-[7px]">
          {arrID.length === 0 ? (
            <div className="w-full flex items-center text-center justify-center text-sm text-[#000000] ">
              {" "}
              {trans.dashboard.showCreateEvent.checklength}
            </div>
          ) : (
            arrID.slice(0, 4).map((item, index) => (
              <div key={index} className="flex flex-col">
                <EventButton
                  title={item.title}
                  id={item.eventId}
                  status={item.status}
                  userJoined={item.userJoined}
                  db={2}
                  onclick={() => dispatch(userCurrentEventHosting(item))}
                />
              </div>
            ))
          )}
          <div onClick={() => {router.push("event-list")}}>
            <Button
              content={trans.dashboard.showCreateEvent.buttonContent}
              primaryColor={LEFT_COLOR}
              secondaryColor={RIGHT_COLOR}
            />
          </div>
        </div>
      </Input>
    );
  }, [arrID]);

  return (
    <>
      {currentUser.userId == null ? (
        checkAuth()
      ) : (
        <div>
          {renderHeader}
          <section className="h-full max-w-xl w-4/5 mx-auto flex flex-col justify-center items-center pt-2">
            {/* {welcome to AIT App} */}
            {renderWelcome}
            {/* participate in event */}
            {renderJoinEvent}
            {/* show my curent event */}
            {renderShowCurrentEvent}
            {/* create new event  */}
            {renderCreateEvent}
            {/* show all my event */}
            {renderShowCreateEvent}
          </section>
        </div>
      )}
    </>
  );
}
