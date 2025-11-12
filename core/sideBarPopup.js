import React, { useState, useEffect } from "react";
import Link from "next/link";
import { CustomIcon } from "core/icon";
import UserImg from "assets/img/profile.png";
import Image from "next/image";
import SubHeading from "./SubHeading";
import H5 from "./H5";
import { HiBadgeCheck } from "react-icons/hi";
import { FiChevronRight } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import { deAuthenticateAction, logout } from "../modules/auth/authActions";
import { useRouter } from "next/router";
import _ from "lodash";
import { BiTime } from "react-icons/bi";
import close1 from "../assets/close1.png";
import { reset, initialize } from "redux-form";
import classNames from "classnames";
import useWindowSize from "utils/useWindowSize";
import { apiRequest } from "utils/Utilities";
import io from "socket.io-client";
import { socket } from "pages/user/user-list";
import MessagePlanSelector from "../components/MessagePlanSelector";

function sideBarPopup({ isOpen, toggle, count }) {
  const width = useWindowSize();
  const user = useSelector((state) => state.authReducer.user);
  const dispatch = useDispatch();
  const router = useRouter();
  const [documentUpoaded, setDocumentUpoaded] = useState(false);
  const [notifData, setNotifdata] = useState(null);
  const [showMessagePlanSelector, setShowMessagePlanSelector] = useState(false);
  // const [count, setCount] = useState(0);
  // const socket = io(socketURL, {
  //   autoConnect: true,
  // });

  useEffect(() => {
    if (user?.selfie && user?.document) {
      setDocumentUpoaded(true);
    }
  }, [user]);

  // Fetch updated user data when sidebar opens
  const fetchUpdatedUserData = async () => {
    try {
      const res = await apiRequest({
        method: "GET",
        url: `user/user-by-name?user_name=${user?.user_name}`,
      });
      if (res?.data?.data?.user) {
        dispatch({
          type: "AUTHENTICATE_UPDATE",
          payload: res.data.data.user,
        });
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
  };

  // TEST: Auto-upgrade to Elite Plan with dial counts
  const handleTestUpgrade = () => {
    if (user?.gender === "male" && (user?.membership_type !== "elite" && user?.membership_type !== "premium")) {
      console.log("🧪 TEST: Upgrading user to Elite Plan with dial counts");
      dispatch({
        type: "AUTHENTICATE_UPDATE",
        payload: {
          ...user,
          membership_type: "elite",
          interested_dials: 18,
          super_interested_dials: 4,
          message_tokens: 10,
          hasActiveMembership: true,
          isPremium: true,
          subscription_status: "active",
        },
      });
      // Close sidebar to show updated state
      toggle();
      // Reopen after a brief delay to show updated state
      setTimeout(() => {
        if (typeof toggle === 'function') {
          toggle();
        }
      }, 100);
    }
  };

  useEffect(() => {
    if (isOpen && user?.user_name) {
      fetchUpdatedUserData();
    }
  }, [isOpen]);

  // const fetchNotifications = async () => {
  //   try {
  //     const params = {
  //       user_email: user.email,
  //       sort: "sent_time",
  //     };
  //     const { data } = await apiRequest({
  //       method: "GET",
  //       url: `notification`,
  //       params: params,
  //     });
  //     setNotifdata(data?.data?.notification);
  //   } catch (err) {
  //     console.error("err", err);
  //   }
  // };

  // useEffect(() => {
  //   fetchNotifications();
  // }, []);

  // useEffect(() => {
  //   if (isOpen) {
  //     fetchNotifications();
  //   }
  // }, [isOpen]);

  // useEffect(() => {
  //   socket.auth = { user: "admin@getnada.com" };
  //   socket.connect();
  //   console.log("socket", socket.auth);
  //   socket.on("connect", () => {
  //     console.log("connected", socket.connected);
  //   });
  //   socket.on("disconnect", (reason) => {
  //     console.log("socket disconnected reason", reason);
  //   });
  //   console.log("socket Notif socket intiated called");
  // }, []);

  // useEffect(() => {
  //   socket.on("connect_error", () => {
  //     console.log("connect_error");
  //     socket.auth = { user: user };
  //     socket.connect();
  //   });
  // }, [!socket.connected]);

  // useEffect(() => {
  //   console.log("Notif socket connected", socket.connected);
  //   socket.on("connect", () => {
  //     console.log(socket.id);
  //   });
  //   socket.on(`push-notification-${user.email}`, (message) => {
  //     console.log("notif received", message);
  //     const unc = message?.notifications?.filter(
  //       (item) => item.status === 0 && item.type !== "notification"
  //     ).length;
  //     localStorage.setItem("unreadNotifCount", JSON.stringify(unc));
  //     setCount(unc);
  //   });
  // }, [socket.connected]);

  // useEffect(() => {
  //   console.log("notiffff ", notifData);
  //   const unc = notifData?.filter(
  //     (item) => item.status === 0 && item.type !== "notification"
  //   ).length;
  //   console.log("count ", unc);
  //   localStorage.setItem("unreadNotifCount", JSON.stringify(unc));
  //   let unreadNotifCount;
  //   unreadNotifCount = localStorage.getItem("unreadNotifCount");
  //   setCount(unreadNotifCount);
  //   console.log("unreadNotifCount ", unreadNotifCount);
  // }, [notifData]);

  const memberSince = user?.created_at
    ? new Date(user?.created_at)?.toLocaleString("en-US", {
        month: "short",
        year: "numeric",
      })
    : "";

  return (
    <div
      className={classNames(
        `modal fade ${
          isOpen ? "show d-block modal-open modal-open-1" : "d-none"
        }`,
        width > 1399 && "modal-fade-1"
      )}
      id="sidebarPop"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
      //style={{ padding: "15px" }}
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div
        className="modal-dialog modal-custom-dailog"
        style={{ marginTop: "47px" }}
      >
        <div
          className="modal-content"
          style={{
            backgroundColor: "black",
            width: "290px",
            //borderRadius: "10px",
          }}
        >
          <div
            className="modal-header p-0"
            style={{ borderBottom: "none", postion: "relative" }}
          >
            <button
              type="button"
              className="btn-close btn-custom"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={toggle}
            >
              <Image
                src={close1}
                alt="user image"
                width={52}
                height={52}
                // className="date-preview-img"
              />
            </button>
          </div>
          <div className="modal-body" style={{ height: `cal(100vh-25%)` }}>
            <div className="sidebar_wrap">
              <div
                className="user-card-sidebar"
                style={{ padding: " 20px 25px" }}
              >
                <div className="d-flex align-items-center mb-4">
                  <figure className="mb-0 p-0">
                    <img
                      src={!_.isEmpty(user) ? user?.images[0] : UserImg}
                      alt="user image"
                      width={40}
                      height={40}
                    />
                  </figure>
                  <span className="userdetails">
                    <H5>{user?.user_name || ""}</H5>
                    <SubHeading title={`Member since ${memberSince}`} />
                  </span>
                </div>
                <div className="d-flex align-items-center mb-0 header_btn_wrap">
                  {router.asPath === "/user/user-profile" ? (
                    <a className="cursor-pointer" onClick={toggle}>
                      View Profile
                    </a>
                  ) : (
                    <Link href="/user/user-profile">
                      <a onClick={toggle}>View Profile</a>
                    </Link>
                  )}

                  <Link href="/auth/profile?edit=true">
                    <a onClick={toggle}>Edit Profile</a>
                  </Link>
                </div>
              </div>
              <div className="verification_card_header text-center mb-3">
                <div className="d-flex align-items-center mb-0 header_btn_wrap">
                  <button
                    type="button"
                    className="d-flex align-items-center justify-content-center profile-btn"
                    onClick={() =>
                      !documentUpoaded && router.push("/verified-profile")
                    }
                  >
                    <span className="pt-0">
                      {user?.documents_verified
                        ? "VERIFIED"
                        : !documentUpoaded
                        ? "VERIFY PROFILE"
                        : "PENDING"}
                    </span>
                    {user?.documents_verified ? (
                      <HiBadgeCheck
                        color={"white"}
                        size={25}
                        style={{ paddingLeft: "5px" }}
                      />
                    ) : !documentUpoaded ? (
                      <HiBadgeCheck
                        color={"white"}
                        size={25}
                        style={{ paddingLeft: "5px" }}
                      />
                    ) : (
                      <BiTime
                        color={"grey"}
                        size={25}
                        style={{ paddingLeft: "5px" }}
                      />
                    )}
                  </button>
                </div>
                <SubHeading title="Let them know you are real" />
              </div>
              {user?.gender === "male" && (
                <div className="verification_card_header text-center mb-3" style={{ padding: "15px 20px", backgroundColor: "#0b0b0b" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                      <span style={{ color: "#AFABAB", fontSize: "12px" }}>
                        {user?.membership_type === "elite" || user?.membership_type === "premium" ? "Membership" : "Current Plan"}
                      </span>
                      <span style={{ color: "rgba(255,255,255,0.9)", fontSize: "14px" }}>
                        <strong>{user?.membership_type === "elite" ? "Elite Plan:" : user?.membership_type === "premium" ? "Premium Plan:" : "The Test Drive:"}</strong>
                        {user?.membership_type === "elite" || user?.membership_type === "premium" ? " Renews Nov 1" : " Limited Access"}
                      </span>
                    </div>
                    {(user?.membership_type === "elite" || user?.membership_type === "premium") && (
                      <button style={{ color: "#f24462", fontSize: "16px", textDecoration: "underline", background: "none", border: "none", cursor: "pointer" }}>
                        Manage
                      </button>
                    )}
                  </div>
                  
                  <div style={{ display: "flex", justifyContent: "space-around", gap: "32px", marginBottom: "16px" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative", width: "110px" }}>
                      <svg width="110" height="120" viewBox="0 0 110 120" style={{ position: "absolute", top: "16px" }}>
                        <circle cx="55" cy="55" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8"/>
                        {(user?.membership_type === "elite" || user?.membership_type === "premium") && user?.interested_dials > 0 && (
                          <circle 
                            cx="55" 
                            cy="55" 
                            r="45" 
                            fill="none" 
                            stroke="url(#gradient1)" 
                            strokeWidth="8"
                            strokeDasharray={`${(user?.interested_dials / 20) * 283} 283`}
                            strokeLinecap="round"
                            transform="rotate(-90 55 55)"
                          />
                        )}
                        <defs>
                          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#6B5DD3"/>
                            <stop offset="100%" stopColor="#F24462"/>
                          </linearGradient>
                        </defs>
                      </svg>
                      <span style={{ color: "rgba(255,255,255,0.9)", fontSize: "14px", fontWeight: "bold", marginBottom: "8px", zIndex: 1 }}>Interested</span>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "80px", zIndex: 1 }}>
                        <span style={{ color: (user?.membership_type === "elite" || user?.membership_type === "premium") ? "rgba(255,255,255,0.9)" : "#AFABAB", fontSize: (user?.membership_type === "elite" || user?.membership_type === "premium") ? "32px" : "14px", fontWeight: "bold" }}>
                          {(user?.membership_type === "elite" || user?.membership_type === "premium") ? (user?.interested_dials || 0) : "Locked"}
                        </span>
                      </div>
                    </div>
                    
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative", width: "110px" }}>
                      <svg width="110" height="120" viewBox="0 0 110 120" style={{ position: "absolute", top: "16px" }}>
                        <circle cx="55" cy="55" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8"/>
                        {(user?.membership_type === "elite" || user?.membership_type === "premium") && user?.super_interested_dials > 0 && (
                          <circle 
                            cx="55" 
                            cy="55" 
                            r="45" 
                            fill="none" 
                            stroke="url(#gradient2)" 
                            strokeWidth="8"
                            strokeDasharray={`${(user?.super_interested_dials / 10) * 283} 283`}
                            strokeLinecap="round"
                            transform="rotate(-90 55 55)"
                          />
                        )}
                        <defs>
                          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#6B5DD3"/>
                            <stop offset="100%" stopColor="#F24462"/>
                          </linearGradient>
                        </defs>
                      </svg>
                      <span style={{ color: "rgba(255,255,255,0.9)", fontSize: "14px", fontWeight: "bold", marginBottom: "8px", zIndex: 1 }}>Super Interested</span>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "80px", zIndex: 1 }}>
                        <span style={{ color: (user?.membership_type === "elite" || user?.membership_type === "premium") ? "rgba(255,255,255,0.9)" : "#AFABAB", fontSize: (user?.membership_type === "elite" || user?.membership_type === "premium") ? "32px" : "14px", fontWeight: "bold" }}>
                          {(user?.membership_type === "elite" || user?.membership_type === "premium") ? (user?.super_interested_dials || 0) : "Locked"}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <p style={{ color: "white", fontSize: "12px", marginBottom: "8px" }}>
                    {(user?.membership_type === "elite" || user?.membership_type === "premium") 
                      ? "Monthly Balance renews Nov 1" 
                      : "Upgrade to unlock monthly balance"}
                  </p>
                  <button 
                    style={{ 
                      width: "100%", 
                      padding: "10px 60px", 
                      backgroundColor: (user?.membership_type === "elite" || user?.membership_type === "premium") ? "#191c21" : "#f24462", 
                      color: "white", 
                      border: (user?.membership_type === "elite" || user?.membership_type === "premium") ? "1px solid #293036" : "none", 
                      borderRadius: "8px", 
                      fontSize: "14px",
                      fontWeight: (user?.membership_type === "elite" || user?.membership_type === "premium") ? "normal" : "bold",
                      cursor: "pointer"
                    }}
                    onClick={() => {
                      if (user?.membership_type === "elite" || user?.membership_type === "premium") {
                        // Show MessagePlanSelector for elite members
                        setShowMessagePlanSelector(true);
                      } else {
                        // TEST: Auto-upgrade for testing
                        handleTestUpgrade();
                        // Original behavior (comment out for production):
                        // router.push("/upgrade-plan");
                      }
                    }}
                  >
                    {(user?.membership_type === "elite" || user?.membership_type === "premium") ? "Top Up Tokens" : "UPGRADE PLAN"}
                  </button>
                </div>
              )}
              {user?.gender === "female" && (
                <div className="verification_card_header text-center mb-0">
                  {/* <div className="mb-1">
                                        <CustomIcon.ChampaignCaviar color={"#AFABAB"} size={50} />
                                    </div> */}
                  {/* <SubHeading title="Stay ahead of the crowd" /> */}
                  <div className="d-flex align-items-center mb-0 mt-1 header_btn_wrap">
                    <button
                      onClick={() => router.push("/create-date/choose-city")}
                      type="button"
                      className="create-date"
                    >
                      Create New Date
                    </button>
                  </div>
                  <SubHeading title="Stay ahead of the crowd" />
                </div>
              )}
              <div className="user-card-sidebar">
                <div
                  className="sidebar_nav_links "
                  style={{ marginTop: "50px", padding: "15px 15px 0px 15px" }}
                >
                  <ul>
                    <li>
                      <Link href="/user/notifications">
                        <div style={{ cursor: "pointer" }}>
                          <a>
                            Notification <FiChevronRight size={22} />{" "}
                          </a>
                          {count > 0 && (
                            <div class="notification-container">
                              <span class="notification-counter">{count}</span>
                            </div>
                          )}
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link href="/">
                        <a>
                          Setting <FiChevronRight size={22} />{" "}
                        </a>
                      </Link>
                    </li>
                    <li>
                      <Link href="/">
                        <a>
                          Privacy <FiChevronRight size={22} />
                        </a>
                      </Link>
                    </li>
                    <li>
                      <Link href="/">
                        <a>
                          Terms <FiChevronRight size={22} />
                        </a>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div
                className="bottom-footer-sidebar"
                style={{ position: "inherit" }}
              >
                <div className="d-flex align-items-center mb-0 header_btn_wrap log-btn login-btn">
                  <button
                    className="log-btn d-flex align-items-center justify-content-center"
                    type="button"
                    style={{ lineHeight: "3" }}
                    onClick={() => {
                      logout(router, dispatch);
                    }}
                  >
                    Log Out
                  </button>
                </div>
                <SubHeading title="LeSociety. Copywrite 2023 " />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <MessagePlanSelector
        isOpen={showMessagePlanSelector}
        onClose={() => setShowMessagePlanSelector(false)}
        onCheckout={(data) => {
          console.log("Message plan checkout:", data);
          // TODO: Integrate with payment API
          // After successful purchase, update user tokens
          dispatch({
            type: "AUTHENTICATE_UPDATE",
            payload: {
              ...user,
              interested_dials: (user?.interested_dials || 0) + (data.quantities.interested || 0),
              super_interested_dials: (user?.super_interested_dials || 0) + (data.quantities["super-interested"] || 0),
            },
          });
          setShowMessagePlanSelector(false);
        }}
        initialQuantities={{ interested: 0, "super-interested": 0 }}
      />
    </div>
  );
}

export default sideBarPopup;

//calc(-0.5 * var(--bs-gutter-x))
