"use client"

import React, { useCallback, useEffect, useState } from 'react'
import prisma from '../lib/prismaClient';
import { User } from '../types/types';
import { Timecard } from '../types/types';
import getCurrentUser from '../actions/getCurrentUser';
import axios from 'axios';
import { object } from 'zod';
import moment, { utc } from 'moment';
import momentTimezone from 'moment-timezone';
// import { error } from 'console';




const App =  (currentUser:User) => {

    const [users, setUsers] = useState([]);
    const [timecards, setTimecards] = useState([])
    const [workingState, setWorkingState] = useState(false)
    const [userId, setUserId] = useState("");
    const [savedStartedTime, setSavedStatedTime] = useState("")
    const [savedEndedTime, setSavedEndedTime] = useState("")
    const [saveStartTime,setSaveStartTime]= useState("")
    const [saveEndTime,setSaveEndTime] = useState("")
    const [startedData, setStartedData] = useState("")
    // const { supabase } = useSpabase();

    useEffect(() => {
        const fetchUsers = async () => {
            const response = await fetch("http://localhost:3000/api/users",{
                cache:'no-store',
            }) 
            
            const usersData:User = await response.json();

        
            // console.log(usersData)
            return usersData
        }
        fetchUsers()
    },[])

    useEffect( () => {
        const fetchTimecards = async () => {
            const response =  fetch("http://localhost:3000/api/timecard",{
                cache:'no-store',
            }) 
            
            const timecardData:Timecard = await (await response).json();
            return timecardData;
        }
        fetchTimecards()
    },[])

    const timecardStart = async() => {
        if(!workingState){

            setWorkingState(true)
    
            // const currentUser = await getCurrentUser()
            if(currentUser){
    
                const userId =  currentUser.id
                const res = await fetch('http://localhost:3000/api/timecard/start',{
                    method:"POST",
                    headers:{
                        "Content-Type":"application/json",
                    },
                    body:JSON.stringify({userId})
                })
                // console.log(res.json());
                const data = await res.json()
                // console.log(data)
                setStartedData(data)
                console.log(data.startedTime.id)
                setUserId(data.startedTime.id);
                // console.log(data.startedTime.startedAt)
                // setSavedStatedTime(data.startedTime.startedAt) 
                // console.log(savedStartedTime);
                const convertedStartTime = moment(data.startedTime.startedAt)
                // setSaveStartTime(convertedStartTime)
                // console.log(convertedStartTime)
                setSaveStartTime(data.startedTime.startedAt)
                // const startTime = convertedTime.add(9,"hours")
                console.log(convertedStartTime.format('YYYY/MM/DD HH:mm:ss'));
                setSavedStatedTime(convertedStartTime.format('YYYY/MM/DD HH:mm:ss'))
    
            } else {
                console.error('エラーです')
            }
        } else {
            alert('すでに開始ボタンが押されています')
        }
        
    }

    const timeCardEnd = async () => {
        
        // useCallback(() => {
        //     setWorkingState(false)

        // },[workingState])

        if (workingState) {

            setWorkingState(false)
            // console.log(userId)
            // console.log(startedData);
            // console.log(savedStartedTime);
            // console.log(startedData)

            // const userId = currentUser.id
            const res = await fetch('http://localhost:3000/api/timecard/end',{
                method:"PUT",
                headers: {
                    "Content-Type": "application/json",   
                },
                body:JSON.stringify({userId,savedStartedTime})
            });
            // console.log(res.body)
            const data = await res.json();
            // console.log(data)
            // console.log(data.endedTime.endedAt)
            const convertedEndTime = moment(data.endedTime.endedAt)
            setSaveEndTime(data.endedTime.endedAt);
            console.log(convertedEndTime.format('YYYY/MM/DD HH:mm:ss'));
            setSavedEndedTime(convertedEndTime.format('YYYY/MM/DD HH:mm:ss'))

            //始まりと終わりの差を計測する
            
            const statedAt = moment(saveStartTime)
            
    
            const diff2 = convertedEndTime.diff(statedAt,'milliseconds')
            console.log(diff2)
            // console.log(moment(diff2).add(-9,'hours').format('hh:mm:ss'))
            // const diffedTime = moment.tz(diff2,'Asia/Tokyo').format('hh:mm:ss')
            // console.log(moment.tz(diff, 'Asia/Tokyo').format('hh:mm:ss'))
            // dif2 = moment.tz()
            // console.log(diffedTime)
            const date= new Date(diff2)
            const hours = date.getUTCHours()
            const minutes = date.getUTCMinutes()
            const seconds = date.getSeconds()

            const formattedTime = `${hours}:${minutes}:${seconds}`
            console.log(formattedTime);
            
        } else {
            
            alert("開始ボタンが押されていません")
        }
        
        //ここらからは別
        // if(currentUser){
        
    }

    
    
    // if(!statedAt || !endedAt){
        
    //     console.log('計測中')
        
    // } else {
        
    // }

  return (
    <div className=' flex flex-col'>
        <h1 className=' text-4xl bg-green-400 text-slate-50 rounded-md font-bold px-[50px] py-[5px] text-center'>
            タイムカード
        </h1>
        <div className=' flex flex-col mt-[60px] gap-5'>
            <div className=' bg-sky-400 w-[800px] h-[60px] flex gap-20 justify-center '>
                <div className='  border-2 border-slate-50 rounded-lg bg-gray-300 my-1 px-5 pt-3 text-center hover:scale-105 active:scale-95 cursor-pointer' onClick={timecardStart} >開始</div>
                <div className='  border-2 border-slate-50 rounded-lg my-1 px-5 pt-3 bg-red-500 hover:scale-105 active:scale-95 cursor-pointer' onClick={timeCardEnd} >停止</div>

                { workingState ? (

                    <div className=' border-2 border-black  my-1 rounded-lg px-5 pt-3 text-red-500 font-bold'  >仕事中</div>
                ):
                (
                    <div className=' border-2 border-black  my-1 rounded-lg px-5 pt-3 text-blue-600 font-bold'  >準備中</div>
                    
                )}
                <div className='  border-2 border-slate-50 rounded-lg my-1 px-5 pt-3 '>経過時間</div>
                <div className=' border-2 border-black text-slate-50 my-1 rounded-lg px-5 pt-3'  >合計時間</div>


            </div>
            {/* <div className=' bg-sky-400 w-[800px] h-[50px] flex gap-20 justify-center '>
                <div className='  border-2 border-slate-50 rounded-lg px-5 pt-3'>ボタン</div>
                <div className=' border-2 border-black text-slate-50 rounded-lg px-5 pt-3'  >状態</div>
                <div className='  border-2 border-slate-50 rounded-lg px-5 pt-3'>計測値</div>
                <div className=' border-2 border-black text-slate-50 rounded-lg px-5 pt-3'  >合計時間</div>


            </div>
            <div className=' bg-sky-400 w-[800px] h-[50px] flex gap-20 justify-center '>
                <div className='  border-2 border-slate-50 rounded-lg px-5 pt-3'>ボタン</div>
                <div className=' border-2 border-black text-slate-50 rounded-lg px-5 pt-3'  >状態</div>
                <div className='  border-2 border-slate-50 rounded-lg px-5 pt-3'>計測値</div>
                <div className=' border-2 border-black text-slate-50 rounded-lg px-5 pt-3'  >合計時間</div>


            </div> */}
        </div>
    </div>
  )
}

export default App