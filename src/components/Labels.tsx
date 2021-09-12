interface Props{
    total:number,
    numTicks:number,
    ending:string,
    isRow:boolean,
    className:string,
}

export function Labels(props:Props){
    let step = props.total/props.numTicks;
    let children = []
    for (let i = 0; i < props.numTicks + 1; i++) {
        children.push(<p className="disable-select" style = {{fontSize:"9px", display:"flex", justifyContent:"center", alignItems:"center", width:".1px", height: ".1px"}}>
            {`${i*step}${props.ending}`}
            </p>)
    }
    return (
        <div className = {props.className} style = {props.isRow?{display:"flex", justifyContent:"space-between", alignItems:"center", width:"100%"}:
        {display:"flex", flexDirection:"column-reverse", justifyContent:"space-between", alignItems:"center", width:"100%"}}>
            {children}
        </div>
    )
}