/* 
* Common:公共组件 
* 与业务无关，纯粹通用，任何项目都能用
* 
* 只关心"长什么样、怎么交互"，不关心"数据是什么业务含义"
* 通过 props 接收数据和回调，自己不做业务判断
* 例如：按钮、弹窗、表格、分页器、上传组件、二次封装的 Select
* 判断标准：把这个组件原样拷到另一个毫不相关的项目里，不需要改任何代码就能用
* 
* 公共组件：它不知道什么叫"订单"，只知道收到一个 title 和 onClick
* <Modal title={title} visible={visible} onOk={onOk} />
*/


import React from "react";

const  CaseOne:React.FC =()=>{
    return <></>
}
export default CaseOne;