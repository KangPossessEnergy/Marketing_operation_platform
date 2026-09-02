/* 
* Business:业务组件
* 由公共组件拼装而成，携带具体业务语义和数据逻辑
* 
* 内部通常包含：接口、数据转换、业务规则判断、权限控制、埋点等
* 例如：营销活动列表卡片、优惠券选择器、用户标签选择器、订单详情面板
* 判断标准：换个项目或换个业务场景就没法直接复用，因为它内部写死了某个接口或某类数据结构
* 
* 业务组件：内部自己去请求活动列表、处理活动状态逻辑
* <ActivitySelect value={activityId} onChange={setActivityId} />
*/


import React from "react";

const  CaseOne:React.FC =()=>{
    return <></>
}
export default CaseOne;