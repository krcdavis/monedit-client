//pattern size and contents don't matter, pass them in
//just pass in the whole row. so, constants do matter...
//pass those in too lol

export default function EditLine ( {pdata} ) {
  return (

<>
<div className = "row">
	<label>{pdata[0]}: 
        <input
          type={pdata[3]}
	  value={pdata[5]}
          onChange={(event) => {
            pdata[1](event.target.value);
            }//change
           }//change 2
        />
</label>
</div>
</>

  )
}