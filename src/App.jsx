import { useState } from "react";
//import { species } from "./data.js";
//import { getImg } from "./utils.js";
import "./styles.css";
import Axios from "axios";
//import DexButton, EditLine
import EditLine from './EditLine';

// env url
const url = "http://localhost:3001/" || process.env.URL;


function DexButton({ name, onDexClick }) {
  //if drag, ret button without onclick
  //mby change class to change color or stg
  return (
    <button className="dexbutton" onClick={onDexClick}>
      {name}
    </button>
  );
}


////////////////////////////////////////////
export default function App() {

//mon currently being viewed or edited
  const [cmon, setCmon] = useState("lileaf");

//current mon's loaded/edited values...
  const [id, setId] = useState('');
  const [name, setName] = useState('');
const [type, setType] = useState('');
const [model, setModel] = useState('');
const [speci, setSpecies] = useState('');//note... could probably be changed back
const [descr, setDescr] = useState('');//also note
const [ability, setAbility] = useState('');

const [hp, setHp] = useState(2);
const [atk, setAtk] = useState(2);
const [def, setDef] = useState(2);
const [luck, setLuck] = useState(2);
const [skill, setSkill] = useState(2);
const [speed, setSpeed] = useState(2);

const [location, setLocation] = useState("");

const [basemovestring, setBasemovestring] = useState("");//temp

//evo stuff...
const [evoto, setEvoto] = useState("");
const [evostage, setEvostage] = useState("");//1/2, 1/3, 2/3, final, noevo
//evo levels not only for actual evo but for over/under exp gains
const [overevolved, setOverevolved] = useState(25);//level at which mon is considered "overevolved"/too strong for that level and gets decreased exp. usually but not necessarily the lowest level it can be obtained at...
const [evolevel, setEvolevel] = useState(25);//level it evolves at, or at which it starts gaining increased exp for being "underevolved"
const [evoby, setEvoby] = useState("level");//method of evo- level, item, etc
//if evo-by is level, the under/over evo levels are ofc used for evolution


const [list, setList] = useState([]);

const [avgHp, setAvgHp] = useState(0);
const [avgAtk, setAvgAtk] = useState(0);
const [avgDef, setAvgDef] = useState(0);
const [avgLuck, setAvgLuck] = useState(0);
const [avgSkill, setAvgSkill] = useState(0);
const [avgSpeed, setAvgSpeed] = useState(0);

//i think type counts can be grouped?
const [typeCounts, setTypeCounts] = useState([]);

//finally, stat avgs per type- can be put in pattern2


const STRI = 0;
const SETTER = 1;
const DEFL = 2;
const TYP = 3;
const CLAS = 4;//className for css, not yet implemented...
const VARB = 5;

const pattern = [
    ["id",setId,"","text","sm",id],
    ["name",setName,"","text","sm",name],
    ["type",setType,"","text","sm",type],
    ["model",setModel,"","text","sm",model],
    ["species",setSpecies,"","text","sm",speci],
    ["descr",setDescr,"","text","bigtext",descr],
    ["ability",setAbility,"","text","sm",ability],
    ["hp",setHp,2,"number","nm",hp],
    ["atk",setAtk,2,"number","nm",atk],
    ["def",setDef,2,"number","nm",def],
    ["luck",setLuck,2,"number","nm",luck],
    ["skill",setSkill,2,"number","nm",skill],
    ["speed",setSpeed,2,"number","nm",speed],

//evo data- stage/final, etc
    ["evoto",setEvoto,"","text","sm",evoto],
    ["evostage",setEvostage,"","text","sm",evostage],// 1/3, 2/3; 1/2; final, noevo
    ["evolevel",setEvolevel,20,"number","nm",evolevel],
    ["evoby",setEvoby,"level","text","sm",evoby],
];

//maybe change order so thse can coexist better
//0 is name of thing to get avg of...
const patt2rn = [
    ["hp",avgHp,setAvgHp],
    ["atk",avgAtk, setAvgAtk],
    ["def",avgDef,setAvgDef],
    ["luck",avgLuck,setAvgLuck],
    ["skill",avgSkill,setAvgSkill],
    ["speed",avgSpeed,setAvgSpeed]
];

//next- ?
//for better reusability- sep stats pattern from the rest, group stat avgs in one setter.


function LeftButtons() {
  const bbuttons = [];
  const size = list.length;
  for (let i = 0; i < size; i++) {
//console.log(list[i].id);
    bbuttons.push(
      <DexButton
        name={list[i].name}
        onDexClick={() => handleDexClick(list[i].id)}
      />
    );//p
  }//f
return(<>{bbuttons}</>);
}//l


function Rightbar() {
//avg stats
const textlines = [];
const asize = patt2rn.length;
  for (let i = 0; i < asize; i++) {
textlines.push( <p>avg {patt2rn[i][0]}: {patt2rn[i][1]}</p> )
}//for

textlines.push(<p>-</p>);

const csize = typeCounts.length;
for (let i=0; i < csize;i++) {
textlines.push(<p>{typeCounts[i]['type']} count: {typeCounts[i]['num']}</p>);
}//for

return(<>{textlines}</>);
}//right


//format?
  const updateList = () => {
    Axios.get("http://localhost:3001/list").then((response) => {
      setList(response.data);
    });

    //Axios avg, count, typeavg
const asize = patt2rn.length;
  for (let i = 0; i < asize; i++) {
Axios.get("http://localhost:3001/avg", {params: {stat: patt2rn[i][0]}}).then((response) => {
//console.log(response.data[0]['AVG('+patt2rn[i][0]+')']);
patt2rn[i][2](response.data[0]['AVG('+patt2rn[i][0]+')']);//fixd
});
}//for

    Axios.get("http://localhost:3001/counts").then((response) => {
      setTypeCounts(response.data);
    });

  };

const psize = pattern.length;


  function handleDexClick(key) {
    setCmon(key);
    Axios.get("http://localhost:3001/getmon", {params: {id: key}}).then((response) => {
  for (let i = 1; i < psize; i++) {
	pattern[i][SETTER](response.data[pattern[i][STRI]] || pattern[i][DEFL]);
	}
    });
setId(key);
}


//do things
  const addMon = () => {//the url....
//create the object using pattern then send it?
const obj = {};
  for (let i = 0; i < psize; i++) {
    obj[ pattern[i][STRI] ] =  pattern[i][VARB] ;
}
    Axios.post("http://localhost:3001/create", obj).then(() => {
      console.log("ok");
//update avgs, buttons
updateList();
    });
  };


//it almost just werks
//should this be a function or should the other things be not functions?
const things = [];

  for (let i = 1; i < psize; i++) {
//things.push new Editline(pattern[i])
things.push(
<EditLine 
pdata = {pattern[i]}
/>
);

}//for




function dumpString() {
//get all mons, stringify, concat, dump to file
const date = new Date();//.getYear();//.toString().padStart(2, '0');
let dateString = date.getFullYear().toString();
dateString += date.getMonth().toString().padStart(2, '0');
dateString += date.getDate().toString().padStart(2, '0');
dateString += date.getHours().toString().padStart(2, '0');
dateString += date.getMinutes().toString().padStart(2, '0');
dateString += date.getSeconds().toString().padStart(2, '0');



//result = Axios /getall
//let result;

    Axios.get("http://localhost:3001/getall").then((response) => {
  console.log(response.data);//array

//extends scripttags
let string = "const datetime = ";
string += dateString;
string += "\nconst species = {\n\t";

//begin
//to do: make this use pattern...
//some things have special formatting...

for (let i = 0; i < response.data.length; i++) {
string += '"'+response.data[i]["id"]+'":\n\t\ttgname:"';
string += response.data[i]["name"];
string += '",\n\t\ttgmodel:"';
string += response.data[i]["model"];
string += '",\n\t\ttgspecies:"';
string += response.data[i]["species"];//check
string += '",\n\t\ttgdescr:"';
string += response.data[i]["descr"];//check
string += '",\n\t\ttgtype:tg';
string += response.data[i]["type"];//not quote
string += ',\n\t\ttgbase:{';

string += ',\n\t\t\ttghp:';
string += response.data[i]["hp"];//toString?
string += ',\n\t\t\ttgatk:';
string += response.data[i]["atk"];
string += ',\n\t\t\ttgdef:';
string += response.data[i]["def"];

string += ',\n\t\t\ttgluck:';
string += response.data[i]["luck"];
string += ',\n\t\t\ttgskill:';
string += response.data[i]["skill"];

string += ',\n\t\t\ttgspeed:';
string += response.data[i]["speed"];
string += '\n\t\t},';

string += '\n\t\ttgability:"';
string += response.data[i]["ability"];

string += '",\n\t\t},\n\t';//end, 


}
string+='}'

const file = new File([string], 'species '+dateString+'.txt');

    // Create a link and set the URL using `createObjectURL`
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = URL.createObjectURL(file);
    link.download = file.name;

    // It needs to be added to the DOM so it can be clicked
    document.body.appendChild(link);
    link.click();

    // To make this work on Firefox we need to wait
    // a little while before removing it.
    setTimeout(() => {
        URL.revokeObjectURL(link.href);
        link.parentNode.removeChild(link);
    }, 0);
    });
}

//do a funny
const [load, setLoad] = useState(true);
if (load) {
console.log("one load");
setLoad(false);
updateList();
}

/////////////////////////
  return (
    <>
      <div class="main">
        <h1>MonStar Chart</h1>
        <div class="box">

          <div class="left"><LeftButtons /></div>

          <div class="mid">
<p>WARNING: ONLY MODIFY ID WHEN ADDING MON</p>
<p>also, save changes before switching mons</p>

{things}



<button onClick={addMon}>add/update mon</button>
<p><button onClick={dumpString}>get file lol</button></p>
          </div>
<div className = "right">
<p><button onClick={updateList}>get list lol</button></p>
averages and other data...
<Rightbar />
</div>
        </div>
      </div>
    </>
  );
}

//NEXT: basemoves is being deprecated. for each levelup move, spawn a move row object, plus functionality to add/remove rows.
//stats.....
//with comparison to average stats, percent of mons which share the typ
//evo data...