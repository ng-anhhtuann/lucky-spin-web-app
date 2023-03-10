/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react/jsx-no-target-blank */
import { React, useCallback, useState, useEffect, useMemo } from "react";
import { LEFT_COLOR, RIGHT_COLOR } from "public/util/colors";
import { db } from "./../../src/firebase";
import { HideMethod, ShowMethod } from "public/util/popup";
import { isEmpty } from "public/util/functions";
import { child, get, ref, set, update } from "firebase/database";
import router from "next/router";
import { useDispatch } from "react-redux";
import { incognitoParticipant, incognitoUser, incognitoEvent, userCurrentEventPlaying, removePlayerState } from "public/redux/actions";
import { usePlayerEventHook, usePlayerParticipantHook } from "public/redux/hooks";
import { usePopUpMessageHook, usePopUpStatusHook, usePopUpVisibleHook, useUserPackageHook } from "public/redux/hooks";
import { Title, Logo, Input, Button, PopUp } from "public/shared";
import TransMess from "public/trans/hooks/TransMess";
const uuid = require("uuid");
const BG_COLOR = "bg-gradient-to-tr from-[#C8EFF1] via-[#B3D2E9] to-[#B9E4A7]";

export default function Info() {
  const [name, setName] = useState("");
  const globalUser = useUserPackageHook();
  const message = usePopUpMessageHook();
  const status = usePopUpStatusHook()
  const visible = usePopUpVisibleHook();

  //Get pinCode from URL
  let pinCode = new URLSearchParams(window.location.search).get('pinCode')

  // Call dispatch from redux
  const dispatch = useDispatch();

  // Get current event from previous state get in
  const currEvent = usePlayerEventHook();

  //Get current user logged in and play
  const currUser = useUserPackageHook()

  const currPlayer = usePlayerParticipantHook();

  // -------------------------------------------Check path--------------------------------------------
  useEffect(() => {
    if ((pinCode === undefined || pinCode === null) && !currEvent.eventId) {
      // alert(1);
      router.push("/");
      return;
    } else if ((pinCode === undefined || pinCode === null) && currEvent.eventId) {
      if (currPlayer.eventId === currEvent.eventId && currPlayer.eventId !== undefined) {
        get(child(ref(db), "event/")).then((snapshot) => {
          const record = snapshot.val() ?? [];
          const values = Object.values(record);
          var event = values.find((item) => item.eventId === currEvent.eventId);
          switch (event.status) {
            case 1:
              ShowMethod(dispatch, TransMess().messagesError.E3001, false);
              setTimeout(() => {
                dispatch(removePlayerState());
                HideMethod(dispatch);
                // alert(2);

                router.push("/");
              }, 500)
              return;
            case 2:
              ShowMethod(dispatch, TransMess().messagesSuccess.I0008(currEvent.title), true);
              setTimeout(() => {
                HideMethod(dispatch);
                // alert(3);

                router.push("event/countdown-checkin/" + currEvent.eventId);
              }, 500);
              return
            case 3:
              ShowMethod(dispatch, TransMess().messagesSuccess.I0008(currEvent.title), true);
              setTimeout(() => {
                HideMethod(dispatch);
                // alert(4);
                router.push("event/luckyspin/" + currEvent.eventId);
              }, 500);
              return;
            case 4:
              dispatch(removePlayerState());
              // alert(5);
              router.push("/");

              return;
            default:
              return;
          }
        });
      }
    } else if (!(pinCode === undefined || pinCode === null) && !currEvent.eventId) {
      dispatch(removePlayerState());
      get(child(ref(db), "event/")).then((snapshot) => {
        const record = snapshot.val() ?? [];
        const values = Object.values(record);
        var event = values.find((item) => item.pinCode === pinCode);
        dispatch(incognitoEvent(event));
        if (globalUser.userId) {
          dispatch(userCurrentEventPlaying(event))
        }
      });
    } else {
      if ((currPlayer.eventId === currEvent.eventId) && (currPlayer.eventId !== undefined)) {
        get(child(ref(db), "event/")).then((snapshot) => {
          const record = snapshot.val() ?? [];
          const values = Object.values(record);
          var event = values.find((item) => item.eventId === currEvent.eventId);
          switch (event.status) {
            case 1:
              ShowMethod(dispatch, TransMess().messagesError.E3001, false);
              setTimeout(() => {
                dispatch(removePlayerState());
                HideMethod(dispatch);
                // alert(6);
                router.push("/");
              }, 500)
              return;
            case 2:
              ShowMethod(dispatch, TransMess().messagesSuccess.I0008(currEvent.title), true);
              setTimeout(() => {
                HideMethod(dispatch);
                // alert(7);
                router.push("event/countdown-checkin/" + currEvent.eventId);
              }, 500);
              return
            case 3:
              ShowMethod(dispatch, TransMess().messagesSuccess.I0008(currEvent.title), true);
              setTimeout(() => {
                HideMethod(dispatch);
                // alert(8);
                router.push("event/luckyspin/" + currEvent.eventId);
              }, 500);
              return;
            case 4:
              ShowMethod(dispatch, TransMess().messagesError.E3003, false);
              setTimeout(() => {
                dispatch(removePlayerState());
                HideMethod(dispatch);
                // alert(9);
                router.push("/");
              }, 500)
              return;
            default:
              return;
          }
        });
      } else {
        get(child(ref(db), "event/")).then((snapshot) => {
          const record = snapshot.val() ?? [];
          const values = Object.values(record);
          var event = values.find((item) => item.pinCode === pinCode);
          if (event === undefined || event.delFlag === true) {
            ShowMethod(dispatch, TransMess().messagesError.E2004, false);
            setTimeout(() => {
              HideMethod(dispatch)
            }, 500)
            return;
          }
          dispatch(incognitoEvent(event));
          if (globalUser.userId) {
            dispatch(userCurrentEventPlaying(event))
          }
        });
      }
    }

  }, [
    // currEvent.eventId, currEvent.title, currPlayer.eventId, dispatch, globalUser.userId, pinCode
  ]);

  // -------------------------------------------Click logic handle------------------------------------
  const onJoinClick = useCallback(() => {
    if (isEmpty(name) || name.replaceAll(" ", "") === "") {
      ShowMethod(dispatch, TransMess().messagesError.E0004, false)
      setTimeout(() => {
        HideMethod(dispatch)
      }, 1000)
      return;
    }
    var id = uuid.v4();
    setName(name.trim());
    var newParticipant = {
      participantId: id,
      createBy: currUser.userId === undefined ? "" : currUser.userId,
      pic: currUser.pic === undefined ? "" : currUser.pic,
      createAt: new Date().getTime(),
      status: 2,
      nameDisplay: name,
      idReward: "",
      eventId: currEvent.eventId,
    };
    get(child(ref(db), "event/")).then((snapshot) => {
      const record = snapshot.val() ?? [];
      const values = Object.values(record);
      var event = values.find((item) => item.eventId === currEvent.eventId);
      if (event === undefined || event.delFlag === true) {
        ShowMethod(dispatch, TransMess().messagesError.E2004, false);
        setTimeout(() => {
          HideMethod(dispatch);
          // alert(10);

          router.push("/")
        }, 1000)
        return;
      }
      console.log(event.status);
      switch (event.status) {
        case 1:
          ShowMethod(dispatch, TransMess().messagesError.E3001, false);
          setTimeout(() => {
            dispatch(removePlayerState())
            HideMethod(dispatch);
            // alert(11);
            router.push("/");
          }, 750)
          return;
        case 2:
          set(ref(db, `event_participants/${id}/`), newParticipant)
            .then(() => {
              event.userJoined += 1;
              update(ref(db, `event/${event.eventId}`),
                {
                  userJoined: event.userJoined,
                }).then(
                  ShowMethod(dispatch, TransMess().messagesSuccess.I0009, true)
                ).catch((e) => {
                  ShowMethod(dispatch, TransMess().messagesError.E4444, false)
                })
              dispatch(incognitoParticipant(newParticipant));

              window.localStorage.setItem('PARTICIPANT_STATE', JSON.stringify(newParticipant.participantId));

              setTimeout(() => {
                HideMethod(dispatch);
                // alert(12);
                router.push("/event/countdown-checkin/" + event.eventId);
              }, 750);
            })
            .catch((e) => {
              ShowMethod(dispatch, TransMess().messagesError.E4444, false)
            });
          // setTimeout(() => {
          //   HideMethod(dispatch);
            // alert(13);
          //   router.push("event/countdown-checkin/" + currEvent.eventId);
          // }, 750);
          return
        case 3:
          ShowMethod(dispatch, TransMess().messagesError.E3002, false);
          setTimeout(() => {
            dispatch(removePlayerState())
            HideMethod(dispatch);
            // alert(14);
            router.push("/");
          }, 750);
          return;
        case 4:
          ShowMethod(dispatch, TransMess().messagesError.E3003(currEvent.title), false);
          setTimeout(() => {
            dispatch(removePlayerState());
            HideMethod(dispatch);
            // alert(15);
            router.push("/");
          }, 750);
          return;
        default:
      }
      if (event.maxTicket <= event.userJoined) {
        ShowMethod(dispatch, TransMess().messagesError.E2005, false);
        setTimeout(() => {
          HideMethod(dispatch)
          dispatch(removePlayerState());
          // alert(16);
          router.push("/");
        }, 1000);
        return;
      }
    });
  }, [currEvent, currUser.pic, currUser.userId, dispatch, name]);

  // -------------------------------------------Components render-------------------------------------
  const setNameData = useCallback(
    (e) => {
      setName(e?.target?.value);
    },
    [setName]
  );

  const renderLogo = useMemo(() => {
    return (
      <Logo />)
  }, [])

  const renderTitle = useMemo(() => {
    return (
      <Title fontSize="text-2xl" fontWeight="font-bold" title="T??n hi???n th???" />
    )
  }, [])

  const renderInput = useMemo(() => {
    return (
      <Input
        placeHolder="Vui l??ng nh???p t??n hi???n th???"
        onChange={setNameData}
        type="text"
        primaryColor={LEFT_COLOR}
        secondaryColor={RIGHT_COLOR}
        noContent={true}
      />
    )
  }, [setNameData])

  const renderButton = useMemo(() => {
    return (
      <div className="w-full mb-4">
        <Button
          content="Tham gia"
          onClick={onJoinClick}
          primaryColor={LEFT_COLOR}
          secondaryColor={RIGHT_COLOR}
        />
      </div>
    )
  }, [onJoinClick])

  const renderPopUp = useMemo(() => {
    return (
      <div className={visible}>
        <PopUp
          text={message}
          status={status}
          isWarning={!status}
        />
      </div>
    )
  }, [visible, status, message])
  //-------------------------------------------------------------------------------------------------

  return (
    <section
      className={`h-screen h-min-full mx-auto flex justify-center items-center ${BG_COLOR}`}
    >
      <div
        className={`flex flex-col justify-center items-center max-w-xl w-4/5 h-full h-min-screen`}
      >
        {renderLogo}
        {renderTitle}
        {renderInput}
        {renderButton}
      </div>
      {renderPopUp}
    </section>
  );
}
