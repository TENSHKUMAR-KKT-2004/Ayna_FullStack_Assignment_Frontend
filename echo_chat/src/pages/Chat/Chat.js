import React, { useEffect, useState, useRef } from "react"
import './Chat.css'
import ChatIcon from '@mui/icons-material/Chat'
import DeleteIcon from '@mui/icons-material/Delete'
import useSessions from "../../hooks/useSessions"
import io from 'socket.io-client'
import { userData } from "../../helper"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"

const ENDPOINT = 'http://localhost:1337'

const Chat = () => {
    const [currentSession, setCurrentSession] = useState(null)
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])
    const [msgLoading, setMsgLoading] = useState(false)
    const [msgError, setMsgError] = useState(null)
    const [sessionList, setSessionList] = useState([])

    const socketRef = useRef(null)
    const newSessionIdRef = useRef(null)

    const { username, uid, jwt } = userData()

    const { loading, error, data: sessions } = useSessions()

    useEffect(() => {
        if (sessions && sessions.sessions && sessions.sessions.data) {
            const sortedSessions = [...sessions.sessions.data].sort(
                (a, b) => new Date(b.attributes.start_time) - new Date(a.attributes.start_time)
            )
            setSessionList(sortedSessions)
        }
    }, [sessions])


    // socket connection
    useEffect(() => {
        socketRef.current = io(ENDPOINT, {
            query: {
                token: jwt
            }
        })

        socketRef.current.on('connect', () => {
            toast.success("Connected to Web Socket server", {
                hideProgressBar: true,
            })
        })

        socketRef.current.on('welcome', (data) => {
            toast.success(data.text, {
                hideProgressBar: true,
            })
        })

        const onSessionDeleted = ({ sessionId }) => {
            setSessionList((prevSessions) => {
                const updatedSessions = prevSessions.filter(session => session.id !== sessionId)
                console.log('Updated sessions:', updatedSessions)
                return updatedSessions
            })

            toast.success("Session deleted successfully", {
                hideProgressBar: true,
            })
        }

        socketRef.current.on('sessionDeleted', onSessionDeleted)

        return () => {
            if (socketRef.current) {
                socketRef.current.off('sessionDeleted', onSessionDeleted)
                socketRef.current.disconnect()
            }
        }
    }, [])

    useEffect(() => {
        if (!loading && !error) {
            const setSidebarHeight = () => {
                const sidebar = document.querySelector('.scrollable-section-1')
                const sidebar2 = document.querySelector('.scrollable-section-2')
                const viewportHeight = window.innerHeight
                const viewportWidth = window.innerWidth
                sidebar2.style.width = `${viewportWidth - 100}px`
                sidebar.style.height = `${viewportHeight}px`
                sidebar2.style.height = `${viewportHeight}px`
            }

            setSidebarHeight()

            window.addEventListener('load', setSidebarHeight)
            window.addEventListener('resize', setSidebarHeight)

            const ls = localStorage.getItem("selected")
            let selected = false
            var list = document.querySelectorAll(".list"),
                content = document.querySelector(".content"),
                input = document.querySelector(".message-footer input"),
                open = document.querySelector(".open a")

            //list click
            function click(l, index) {
                list.forEach(x => { x.classList.remove("active") })
                if (l) {
                    l.classList.add("active")
                    document.querySelector("sidebar").classList.remove("opened")
                    open.innerText = "UP"
                    const
                        user = l.querySelector(".user").innerText,
                        time = l.querySelector(".time").innerText

                    content.querySelector(".info .user").innerHTML = user
                    content.querySelector(".info .time").innerHTML = time

                    const inputPH = input.getAttribute("data-placeholder")
                    input.placeholder = inputPH.replace("{0}", user.split(' ')[0])

                    document.querySelector(".message-wrap").scrollTop = document.querySelector(".message-wrap").scrollHeight

                    localStorage.setItem("selected", index)
                }
            }

            //process
            function process() {
                if (ls != null) {
                    selected = true
                    click(list[ls], ls)
                }
                if (!selected) {
                    click(list[0], 0)
                }

                list.forEach((l, i) => {
                    l.addEventListener("click", function () {
                        click(l, i)
                    })
                })

                try {
                    document.querySelector(".list.active").scrollIntoView(true)
                }
                catch { }

            }
            process()

            return () => {
                window.removeEventListener('load', setSidebarHeight)
                window.removeEventListener('resize', setSidebarHeight)
                list.forEach((l, i) => {
                    l.removeEventListener("click", () => click(l, i))
                })
            }
        }
    }, [loading, error, sessionList])

    useEffect(() => {
        if (newSessionIdRef.current) {
            const newSessionElement = document.getElementById(`session-${newSessionIdRef.current}`)
            if (newSessionElement) {
                newSessionElement.click()
                newSessionIdRef.current = null
            }
        }
    }, [sessionList])

    console.log('sl', sessionList)
    const handleOpenClick = (e) => {
        const sidebar = document.querySelector("sidebar")
        sidebar.classList.toggle("opened")
        if (sidebar.classList.contains('opened')) {
            e.target.innerText = "DOWN"
        } else {
            e.target.innerText = "UP"
        }
    }

    const handleSessionSelect = (session) => {
        setCurrentSession(session)
        setMsgLoading(true)
        setMsgError(null)
        setMessages([])

        socketRef.current.emit('fetchMessages', { userId: uid, sessionId: session })

        socketRef.current.on('messages', (data) => {
            setMsgLoading(false)
            if (data.error) {
                setMsgError(data.error)
            } else if (data.messages) {
                setMessages(data.messages)
            }
        })
    }

    const handleSendMessage = () => {
        const payload = {
            userId: uid,
            username,
            sessionId: currentSession ? currentSession : null,
            message,
        }

        if (socketRef.current) {
            socketRef.current.emit('sendMessage', payload)
            socketRef.current.on('resMessage', (newMessages) => {
                const formattedMessages = newMessages.map((newMsg) => ({
                    id: newMsg.data.id,
                    content: newMsg.data.attributes.content,
                    is_read: newMsg.data.attributes.is_read,
                    createdAt: newMsg.data.attributes.createdAt,
                    updatedAt: newMsg.data.attributes.updatedAt,
                    publishedAt: newMsg.data.attributes.publishedAt,
                    sender: newMsg.data.attributes.sender,
                    users_permissions_user: {
                        id: uid,
                        username: username
                    },
                    session: {
                        id: currentSession
                    },
                }))

                setMessages((prevMessages) => {
                    const combinedMessages = [...prevMessages, ...formattedMessages]
                    const uniqueMessages = Array.from(
                        new Set(combinedMessages.map((msg) => msg.id))
                    ).map((id) => combinedMessages.find((msg) => msg.id === id))
                    return uniqueMessages
                })
            })

            socketRef.current.on('updatedSession', (updatedSession) => {
                setSessionList((prevSessions) => {
                    const updatedSessionList = prevSessions.map(session => {
                        if (session.id == updatedSession.id) {
                            return {
                                ...session,
                                attributes: {
                                    ...session.attributes,
                                    name: updatedSession.name,
                                    start_time: updatedSession.start_time,
                                    active: updatedSession.active,
                                    updatedAt: updatedSession.updatedAt,
                                    last_message: updatedSession.last_message
                                }
                            }
                        }
                        return session
                    })

                    const sortedSessions = updatedSessionList.sort((a, b) => new Date(b.attributes.start_time) - new Date(a.attributes.start_time))

                    return [...sortedSessions]
                })

                newSessionIdRef.current = updatedSession.id
            })

            setMessage('')
        }
        setMessage('')
    }

    if (error) return <p>Error: {error.message}</p>
    if (msgError) return <p>Error: {error.message}</p>

    const getTimeDifference = (startTime) => {
        const now = new Date()
        const sessionTime = new Date(startTime)
        const differenceInMs = now - sessionTime
        const differenceInHours = differenceInMs / (1000 * 60 * 60)

        if (differenceInHours < 1) {
            return `${Math.floor(differenceInMs / (1000 * 60))} minutes ago`
        } else if (differenceInHours < 24) {
            return `${Math.floor(differenceInHours)} hours ago`
        } else {
            return sessionTime.toLocaleDateString()
        }
    }

    const handleNewSession = () => {
        setMessages([])
        setCurrentSession('')

        socketRef.current.on('newSession', (newSession) => {
            const formattedNewSession = {
                __typename: "SessionEntity",
                id: newSession.newSession.id,
                attributes: {
                    __typename: "Session",
                    name: newSession.newSession.name,
                    users_permissions_user: {
                        __typename: "UsersPermissionsUserEntityResponse",
                        data: {
                            __typename: "UsersPermissionsUserEntity",
                            id: uid,
                            attributes: {
                                __typename: "UsersPermissionsUser",
                                username: username
                            }
                        }
                    },
                    start_time: newSession.newSession.start_time,
                    last_message: newSession.newSession.last_message,
                    active: newSession.newSession.active
                }
            }


            setSessionList((prevSessions) => {
                const combinedSessions = [...prevSessions, formattedNewSession]
                const uniqueSessions = Array.from(
                    new Set(combinedSessions.map((session) => session.id))
                ).map((id) => combinedSessions.find((session) => session.id === id))

                const sortedSessions = uniqueSessions.sort(
                    (a, b) => new Date(b.attributes.start_time) - new Date(a.attributes.start_time)
                )
                return sortedSessions
            })

            newSessionIdRef.current = formattedNewSession.id

        })
    }

    const handleDeleteSession = (session_id) => {
        socketRef.current.emit('deleteSession', { userId: uid, sessionId: session_id })
    }

    return (
        <div className="container">
            <sidebar className="scrollable-section-1">
                <span className="logo">EchoChat</span>
                <div className="list-wrap scroll-container">
                    <div onClick={handleNewSession} className="list">
                        <div className="info new-chat">
                            <span className="user">New Chat</span>
                        </div>
                        <span className="time"><ChatIcon /></span>
                    </div>
                    {loading ? (
                        <p>Loading...</p>
                    ) : (sessionList.map(session => (
                        <div className="list" id={`session-${session.id}`} onClick={() => handleSessionSelect(session.id)} key={session.id}>
                            <div className="info">
                                <span className="user">{session.attributes.name}</span>
                                <span className="text">{session.attributes.last_message}</span>
                            </div>
                            <span className="time">
                                {getTimeDifference(session.attributes.start_time)}
                            </span>
                            <div><DeleteIcon onClick={() => handleDeleteSession(session.id)} /></div>
                        </div>
                    )))}
                </div>
            </sidebar>
            <div className="content scrollable-section-2">
                <header>
                    <img src="" alt="" />
                    <div className="info">
                        <span className="user"></span>
                        <span className="time"></span>
                    </div>
                    <div style={{ paddingRight: '10px' }}>Hi, {username}</div>
                    <div>
                        <Link to={'/logout'} className="navbar-link">Logout</ Link>
                    </div>
                    <div className="open">
                        <a href="javascript: " onClick={handleOpenClick}>UP</a>
                    </div>
                </header>
                <div className="message-wrap scroll-container">

                    {msgLoading ? (
                        <p>Loading...</p>
                    ) : (messages.map((message) => (
                        <div key={message.id} className={`message-list ${message.sender === 'server' ? '' : 'me'}`}>
                            <div className="msg">
                                <p>{message.content}</p>
                            </div>
                            <div className="time">{getTimeDifference(message.createdAt)}</div>
                        </div>
                    )))}

                </div>
                <div className="message-footer">
                    <input type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        data-placeholder="Send a message to {0}" />
                    <button onClick={handleSendMessage}>Send</button>
                </div>
            </div>
        </div>
    )
}

export default Chat