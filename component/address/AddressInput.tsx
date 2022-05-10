import { useState, useRef, useCallback } from "react"
import DaumPost from "./DaumPost";
import addressStyle from "../../styles/address/address.module.css"
import { NextPage } from "next";
import React from "react";


const AddressInput: NextPage<{ setAddressFunction: Function, setZonecodeFunction: Function }> = ({ setAddressFunction, setZonecodeFunction }) => {
  const [zonecode, setZonecode] = useState(''); // 우편번호
  const [address, setAddress] = useState(''); // 주소
  const [isOpenPost, setIsOpenPost] = useState(false);

  const opendaumPost = (event: any) => {
    event.preventDefault()
    setIsOpenPost(!isOpenPost)
  }

  const getAddress = useCallback((value: any) => {
    setAddressFunction(value)
    setAddress(value)
  }, [address])
  const getZonecode = useCallback((value: any) => {
    setZonecodeFunction(value)
    setZonecode(value)

  }, [zonecode])
  return (
    <div className={addressStyle.addressform}>

      <div className={addressStyle.addressinput}>
        <input className={addressStyle.input} type="text" id="zonecode" defaultValue={zonecode} placeholder="우편번호" />
        <button type="button" onClick={opendaumPost} defaultValue="우편번호 찾기">주소검색</button><br />
      </div>
      <input className={addressStyle.input} type="text" id="address" defaultValue={address} placeholder="주소" />
      {isOpenPost ?
        <div>
          <DaumPost
            setAddressFunction={getAddress}
            setZonecodeFunction={getZonecode}
          />
        </div> : ""}

    </div>
  )
}

export default React.memo(AddressInput)