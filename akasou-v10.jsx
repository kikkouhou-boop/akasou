import { useState, useRef, useCallback, useEffect } from "react";

const SANS = "'Hiragino Kaku Gothic ProN','Noto Sans JP',sans-serif";
const MONO = "'JetBrains Mono','Courier New',monospace";
const C = {
  bg:"#0a0c10", panel:"#161b22", border:"#21262d", border2:"#30363d",
  accent:"#58a6ff", accent2:"#1f6feb", text:"#e6edf3", sub:"#7d8590",
  dim:"#2563eb", ok:"#3fb950", warn:"#d29922", err:"#f85149",
};

// ══════════════════════════════════════════════════
// 共通SVG部品
// ══════════════════════════════════════════════════
const JisArrow = ({ x1,y1,x2,y2,col=C.dim }) => {
  const dx=x2-x1, dy=y2-y1, len=Math.hypot(dx,dy);
  if (len<1) return null;
  const nx=dx/len, ny=dy/len, L=7, W2=2.5;
  return <g>
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={col} strokeWidth={0.7}/>
    <polygon points={`${x2},${y2} ${x2-nx*L-ny*W2},${y2-ny*L+nx*W2} ${x2-nx*L+ny*W2},${y2-ny*L-nx*W2}`} fill={col}/>
  </g>;
};

const Dim = ({ ax,ay,bx,by,val,gap=-32,orient="h",onEdit }) => {
  const [editing, setEditing] = useState(false);
  const [tmpVal, setTmpVal] = useState("");
  const label = `${Math.round(val)}`;
  const fSize = 9;
  const pad = 3;
  const tLen = label.length * fSize * 0.62;

  const startEdit = (e) => {
    e.stopPropagation();
    if (!onEdit) return;
    setTmpVal(String(Math.round(val)));
    setEditing(true);
  };
  const commitEdit = () => {
    const n = parseInt(tmpVal,10);
    if (!isNaN(n) && n > 0) onEdit(n);
    setEditing(false);
  };

  if (orient==="h") {
    const ey = ay + gap;
    const tx = (ax+bx)/2;
    const ty = ey + (gap<0 ? -5 : 13);
    return <g>
      <line x1={ax} y1={ay+(gap<0?-2:2)} x2={ax} y2={ey+(gap<0?6:-6)} stroke={C.dim} strokeWidth={0.5}/>
      <line x1={bx} y1={by+(gap<0?-2:2)} x2={bx} y2={ey+(gap<0?6:-6)} stroke={C.dim} strokeWidth={0.5}/>
      <JisArrow x1={ax} y1={ey} x2={bx} y2={ey} col={C.dim}/>
      <JisArrow x1={bx} y1={ey} x2={ax} y2={ey} col={C.dim}/>
      <rect x={tx-tLen/2-pad} y={ty-fSize-pad+2} width={tLen+pad*2} height={fSize+pad*2-2}
        fill={editing?"#fff9c4":onEdit?"#e8f4ff":"white"} opacity={0.95}
        rx={onEdit?2:0} stroke={onEdit?"#2563eb":"none"} strokeWidth={onEdit?0.5:0}
        style={onEdit?{cursor:"pointer"}:{}} onClick={startEdit}/>
      {editing
        ? <foreignObject x={tx-22} y={ty-fSize-pad+1} width={44} height={fSize+pad*2}>
            <input
              style={{width:"100%",fontSize:9,border:"1px solid #2563eb",borderRadius:2,textAlign:"center",padding:"1px",outline:"none",background:"#fffde7"}}
              value={tmpVal} autoFocus
              onChange={e=>setTmpVal(e.target.value)}
              onBlur={commitEdit}
              onKeyDown={e=>{if(e.key==="Enter")commitEdit();if(e.key==="Escape")setEditing(false);}}
            />
          </foreignObject>
        : <text x={tx} y={ty} textAnchor="middle" fill={C.dim} fontSize={fSize} fontFamily={MONO} fontWeight="600"
            style={onEdit?{cursor:"pointer"}:{}} onClick={startEdit}>{label}</text>
      }
    </g>;
  } else {
    const ex = ax + gap;
    const tx = ex + (gap<0 ? -6 : 12);
    const ty = (ay+by)/2;
    return <g>
      <line x1={ax+(gap<0?-2:2)} y1={ay} x2={ex+(gap<0?6:-6)} y2={ay} stroke={C.dim} strokeWidth={0.5}/>
      <line x1={bx+(gap<0?-2:2)} y1={by} x2={ex+(gap<0?6:-6)} y2={by} stroke={C.dim} strokeWidth={0.5}/>
      <JisArrow x1={ex} y1={ay} x2={ex} y2={by} col={C.dim}/>
      <JisArrow x1={ex} y1={by} x2={ex} y2={ay} col={C.dim}/>
      <rect x={tx-fSize/2-pad+1} y={ty-tLen/2-pad} width={fSize+pad*2-2} height={tLen+pad*2}
        fill={editing?"#fff9c4":onEdit?"#e8f4ff":"white"} opacity={0.95}
        rx={onEdit?2:0} stroke={onEdit?"#2563eb":"none"} strokeWidth={onEdit?0.5:0}
        transform={`rotate(-90,${tx},${ty})`}
        style={onEdit?{cursor:"pointer"}:{}} onClick={startEdit}/>
      {editing
        ? <foreignObject x={tx-22} y={ty-8} width={44} height={16}>
            <input
              style={{width:"100%",fontSize:9,border:"1px solid #2563eb",borderRadius:2,textAlign:"center",padding:"1px",outline:"none",background:"#fffde7"}}
              value={tmpVal} autoFocus
              onChange={e=>setTmpVal(e.target.value)}
              onBlur={commitEdit}
              onKeyDown={e=>{if(e.key==="Enter")commitEdit();if(e.key==="Escape")setEditing(false);}}
            />
          </foreignObject>
        : <text x={tx} y={ty+fSize*0.35} textAnchor="middle" fill={C.dim} fontSize={fSize} fontFamily={MONO} fontWeight="600"
            transform={`rotate(-90,${tx},${ty})`}
            style={onEdit?{cursor:"pointer"}:{}} onClick={startEdit}>{label}</text>
      }
    </g>;
  }
};

const Grain = ({ x,y,w,h,dir="h" }) => {
  const n=6;
  return <g>{Array.from({length:n-1},(_,i)=> dir==="h"
    ? <line key={i} x1={x+2} y1={y+h/n*(i+1)} x2={x+w-2} y2={y+h/n*(i+1)} stroke="#b5882a" strokeWidth={0.4} strokeDasharray="3,2" opacity={0.5}/>
    : <line key={i} x1={x+w/n*(i+1)} y1={y+2} x2={x+w/n*(i+1)} y2={y+h-2} stroke="#b5882a" strokeWidth={0.4} strokeDasharray="3,2" opacity={0.5}/>
  )}</g>;
};

// 部品寸法注記（正面図内・各部品にW×H×D表示）
const CompDimLabel = ({ comp, ox, oy, sc, totalH }) => {
  const { width:W=0, height:H=0, depth:D=0, position:pos={}, is_hidden } = comp;
  if (is_hidden || W<=0 || H<=0) return null;
  const px = (pos.x||0)*sc + ox;
  const py = oy + (totalH - (pos.y||0) - H)*sc;
  const w = W*sc, h = H*sc;
  const cx = px + w/2;
  const cy = py + h/2;
  const label = `${Math.round(W)}×${Math.round(H)}×${Math.round(D)}`;
  const fSize = 7.5;
  const tLen = label.length * fSize * 0.62;
  const pad = 2.5;
  const inside = w > tLen + pad*2 + 4 && h > fSize + pad*2 + 4;
  if (inside) {
    return <g>
      <rect x={cx-tLen/2-pad} y={cy-fSize/2-pad} width={tLen+pad*2} height={fSize+pad*2} fill="white" opacity={0.85} rx={1}/>
      <text x={cx} y={cy+fSize*0.35} textAnchor="middle" fill="#1a56a8" fontSize={fSize} fontFamily={MONO} fontWeight="600">{label}</text>
    </g>;
  }
  const lx = px + w + 8, ly = py + h/2;
  return <g>
    <line x1={px+w} y1={ly} x2={lx+2} y2={ly} stroke="#1a56a8" strokeWidth={0.5} strokeDasharray="2,1.5"/>
    <rect x={lx+2} y={ly-fSize/2-pad} width={tLen+pad*2} height={fSize+pad*2} fill="white" opacity={0.9} rx={1}/>
    <text x={lx+4+pad} y={ly+fSize*0.35} fill="#1a56a8" fontSize={fSize} fontFamily={MONO} fontWeight="600">{label}</text>
  </g>;
};

// SVGアーク描画ヘルパー
const arcPath = (cx,cy,r,startDeg,endDeg) => {
  const s=startDeg*Math.PI/180, e=endDeg*Math.PI/180;
  const x1=cx+r*Math.cos(s), y1=cy+r*Math.sin(s);
  const x2=cx+r*Math.cos(e), y2=cy+r*Math.sin(e);
  const large=Math.abs(endDeg-startDeg)>180?1:0;
  return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
};

// ══════════════════════════════════════════════════
// 部品→2D投影レンダラー
// 各部品を正面/側面/平面に投影して描画
// ══════════════════════════════════════════════════

// スケール変換ユーティリティ
function makeProjector(OW, OH, OD, areaW, areaH, margin=0.82) {
  const scF = Math.min((areaW-50)/OW, (areaH-50)/OH)*margin;
  const scS = Math.min((areaW-50)/OD, (areaH-50)/OH)*margin;
  const scT = Math.min((areaW-50)/OW, (areaH-50)/OD)*margin;
  return { scF, scS, scT };
}

// 1部品のSVG描画（正面図）
function CompFront({ comp, ox,oy, sc, totalH }) {
  const { shape="rect", width:W=0, height:H=0, depth:D=0,
    position:pos={}, grain_direction, arc_radius, arc_start_deg, arc_end_deg,
    is_hidden } = comp;
  const px = (pos.x||0)*sc + ox;
  const py = oy + (totalH - (pos.y||0) - H)*sc;
  const w = W*sc, h = H*sc;

  const fill = is_hidden ? "none" : "#e0d8c8";
  const stroke = "#333";
  const sw = is_hidden ? 0 : 0.8;
  const dashArray = is_hidden ? "4,2" : undefined;

  if (shape==="cylinder") {
    const r = (W/2)*sc;
    return <g>
      <ellipse cx={px+r} cy={py+h} rx={r} ry={r*0.3} fill="#d8d0c0" stroke={stroke} strokeWidth={sw}/>
      <rect x={px} y={py} width={w} height={h} fill={fill} stroke={stroke} strokeWidth={sw}/>
      <ellipse cx={px+r} cy={py} rx={r} ry={r*0.3} fill="#e8e0d0" stroke={stroke} strokeWidth={sw}/>
    </g>;
  }
  if (shape==="arc_panel" && arc_radius) {
    const R = arc_radius*sc;
    const sa = arc_start_deg||180, ea = arc_end_deg||360;
    const cxA = px + w/2, cyA = py;
    return <g>
      <path d={arcPath(cxA,cyA,R,sa,ea)} fill="none" stroke={stroke} strokeWidth={sw} strokeDasharray={dashArray}/>
      <path d={arcPath(cxA,cyA,R-h,sa,ea)} fill="none" stroke={stroke} strokeWidth={sw*0.7} strokeDasharray="3,2"/>
    </g>;
  }
  return <g>
    <rect x={px} y={py} width={Math.max(w,1)} height={Math.max(h,1)} fill={fill} stroke={stroke} strokeWidth={sw} strokeDasharray={dashArray}/>
    {!is_hidden && grain_direction && <Grain x={px} y={py} w={w} h={h} dir={grain_direction==="縦目"?"v":"h"}/>}
  </g>;
}

// 1部品のSVG描画（側面図）
function CompSide({ comp, ox,oy, sc, totalH }) {
  const { shape="rect", width:W=0, height:H=0, depth:D=0,
    position:pos={}, grain_direction, arc_radius, arc_start_deg, arc_end_deg, is_hidden } = comp;
  const px = (pos.z||0)*sc + ox;
  const py = oy + (totalH - (pos.y||0) - H)*sc;
  const w = D*sc, h = H*sc;
  const fill = is_hidden ? "none" : "#d8d0c0";
  const stroke = "#333";
  const sw = is_hidden ? 0 : 0.8;
  const dashArray = is_hidden ? "4,2" : undefined;

  if (shape==="cylinder") {
    const r = (W/2)*sc;
    return <g>
      <ellipse cx={px+w/2} cy={py+h} rx={w/2} ry={w*0.15} fill="#d0c8b8" stroke={stroke} strokeWidth={sw}/>
      <rect x={px} y={py} width={Math.max(w,1)} height={Math.max(h,1)} fill={fill} stroke={stroke} strokeWidth={sw}/>
    </g>;
  }
  if (shape==="arc_panel" && arc_radius) {
    return <g>
      <rect x={px} y={py} width={Math.max(w,1)} height={Math.max(h,1)} fill={fill} stroke={stroke} strokeWidth={sw} strokeDasharray="4,2"/>
    </g>;
  }
  return <g>
    <rect x={px} y={py} width={Math.max(w,1)} height={Math.max(h,1)} fill={fill} stroke={stroke} strokeWidth={sw} strokeDasharray={dashArray}/>
    {!is_hidden && grain_direction && <Grain x={px} y={py} w={w} h={h} dir={grain_direction==="縦目"?"v":"h"}/>}
  </g>;
}

// 1部品のSVG描画（平面図）
function CompTop({ comp, ox,oy, sc, totalD }) {
  const { shape="rect", width:W=0, height:H=0, depth:D=0,
    position:pos={}, grain_direction, arc_radius, arc_start_deg, arc_end_deg, is_hidden } = comp;
  const px = (pos.x||0)*sc + ox;
  const py = (pos.z||0)*sc + oy;
  const w = W*sc, d = D*sc;
  const fill = is_hidden ? "none" : "#e8e0d0";
  const stroke = "#333";
  const sw = is_hidden ? 0 : 0.8;
  const dashArray = is_hidden ? "4,2" : undefined;

  if (shape==="cylinder") {
    const r=(W/2)*sc;
    return <ellipse cx={px+r} cy={py+r} rx={r} ry={r} fill={fill} stroke={stroke} strokeWidth={sw} strokeDasharray={dashArray}/>;
  }
  if (shape==="arc_panel" && arc_radius) {
    const R=arc_radius*sc, sa=arc_start_deg||180, ea=arc_end_deg||360;
    const cxA=px+w/2, cyA=py+d;
    return <g>
      <path d={arcPath(cxA,cyA,R,sa,ea)+" L "+cxA+" "+cyA+" Z"} fill={fill} stroke={stroke} strokeWidth={sw}/>
    </g>;
  }
  return <g>
    <rect x={px} y={py} width={Math.max(w,1)} height={Math.max(d,1)} fill={fill} stroke={stroke} strokeWidth={sw} strokeDasharray={dashArray}/>
    {!is_hidden && grain_direction && <Grain x={px} y={py} w={w} h={d} dir={grain_direction==="縦目"?"v":"h"}/>}
  </g>;
}

// ══════════════════════════════════════════════════
// 2D JIS図面シート（コンポーネント駆動）
// ══════════════════════════════════════════════════
function Drawing2D({ data, svgRef, onDimChange }) {
  if (!data) return null;
  const { overall_dimensions:od={}, components:comps=[], furniture_name, material } = data;
  const OW=+od.width||800, OH=+od.height||750, OD=+od.depth||500;

  const SVG_W=1120, SVG_H=860, TBH=70;
  const dH=SVG_H-TBH, MAR=62;

  // ゾーン（正面:左上大、側面:右上、平面:左下）
  const fZoneW=SVG_W*0.52, fZoneH=dH*0.63;
  const sZoneW=SVG_W*0.46, sZoneH=dH*0.63;
  const tZoneW=SVG_W*0.52, tZoneH=dH*0.37;

  const scF=Math.min((fZoneW-MAR*2)/OW,(fZoneH-MAR*1.5)/OH)*0.82;
  const scS=Math.min((sZoneW-MAR*2)/OD,(sZoneH-MAR*1.5)/OH)*0.82;
  const scT=Math.min((tZoneW-MAR*2)/OW,(tZoneH-MAR*1.5)/OD)*0.82;

  const fW=OW*scF, fH=OH*scF;
  const sW=OD*scS, sH=OH*scS;
  const tW=OW*scT, tD=OD*scT;

  const fOX=MAR+(fZoneW-MAR*2-fW)/2, fOY=dH*0.37+MAR*0.5+(fZoneH-MAR-fH)/2;
  const sOX=SVG_W*0.52+MAR*0.5+(sZoneW-MAR*2-sW)/2, sOY=fOY+(fH-sH)/2;
  const tOX=MAR+(tZoneW-MAR*2-tW)/2, tOY=MAR+(tZoneH-MAR*1.5-tD)/2;

  // 外形線（全体）
  const OutlineRect = ({x,y,w,h}) => <rect x={x} y={y} width={w} height={h} fill="none" stroke="#111" strokeWidth={1.8}/>;

  // 部品をdepth順(背面→前面)にソート
  const sortedComps = [...comps].sort((a,b)=>((a.position?.z||0)-(b.position?.z||0)));

  return (
    <svg ref={svgRef} width={SVG_W} height={SVG_H} viewBox={`0 0 ${SVG_W} ${SVG_H}`}
      style={{background:"#fff",maxWidth:"100%",display:"block",border:"1px solid #ccc"}}
      xmlns="http://www.w3.org/2000/svg">
      <rect width={SVG_W} height={SVG_H} fill="white"/>
      <rect x={14} y={10} width={SVG_W-28} height={SVG_H-TBH-10} fill="none" stroke="#ddd" strokeWidth={0.5}/>
      <rect x={20} y={16} width={SVG_W-40} height={SVG_H-TBH-20} fill="none" stroke="#333" strokeWidth={0.8}/>
      <text x={28} y={28} fontSize={9} fill="#555" fontFamily={SANS} fontWeight="600">第三角法</text>
      <text x={28} y={38} fontSize={7} fill="#aaa" fontFamily={SANS}>THIRD ANGLE PROJECTION — JIS B 0001</text>

      {/* 分割線 */}
      <line x1={SVG_W*0.52} y1={25} x2={SVG_W*0.52} y2={SVG_H-TBH-10} stroke="#ddd" strokeWidth={0.6}/>
      <line x1={25} y1={dH*0.37} x2={SVG_W*0.52-5} y2={dH*0.37} stroke="#ddd" strokeWidth={0.6}/>

      {/* ビューラベル */}
      {[
        [fOX+fW/2, fOY-22, "正　面　図", "FRONT VIEW"],
        [tOX+tW/2, tOY-22, "平　面　図", "TOP VIEW"],
        [sOX+sW/2, sOY-22, "右　側　面　図", "RIGHT SIDE VIEW"],
      ].map(([x,y,ja,en],i)=><g key={i}>
        <text x={x} y={y} textAnchor="middle" fontSize={9} fill="#222" fontFamily={SANS} fontWeight="700">{ja}</text>
        <text x={x} y={y+10} textAnchor="middle" fontSize={7} fill="#999" fontFamily={SANS}>{en}</text>
      </g>)}

      {/* 投影補助線 */}
      <line x1={fOX} y1={fOY} x2={tOX} y2={tOY+tD} stroke="#ccc" strokeWidth={0.35} strokeDasharray="3,2"/>
      <line x1={fOX+fW} y1={fOY} x2={tOX+tW} y2={tOY+tD} stroke="#ccc" strokeWidth={0.35} strokeDasharray="3,2"/>
      <line x1={fOX+fW} y1={fOY} x2={sOX} y2={sOY} stroke="#ccc" strokeWidth={0.35} strokeDasharray="3,2"/>
      <line x1={fOX+fW} y1={fOY+fH} x2={sOX} y2={sOY+sH} stroke="#ccc" strokeWidth={0.35} strokeDasharray="3,2"/>

      {/* ── 正面図 ── */}
      {sortedComps.map((c,i)=><CompFront key={i} comp={c} ox={fOX} oy={fOY} sc={scF} totalH={OH}/>)}
      {sortedComps.map((c,i)=><CompDimLabel key={`dl${i}`} comp={c} ox={fOX} oy={fOY} sc={scF} totalH={OH}/>)}
      <OutlineRect x={fOX} y={fOY} w={fW} h={fH}/>
      {/* 中心線 */}
      <line x1={fOX+fW/2} y1={fOY+4} x2={fOX+fW/2} y2={fOY+fH-4} stroke="#888" strokeWidth={0.5} strokeDasharray="8,3,1,3"/>
      {/* 断面指示線 */}
      <line x1={fOX-14} y1={fOY+fH*0.4} x2={fOX+fW+14} y2={fOY+fH*0.4} stroke="#cc2200" strokeWidth={0.8} strokeDasharray="6,3,1,3"/>
      <text x={fOX-12} y={fOY+fH*0.4-4} fontSize={8} fill="#cc2200" fontFamily={MONO} fontWeight="700">A</text>
      <text x={fOX+fW+8} y={fOY+fH*0.4-4} fontSize={8} fill="#cc2200" fontFamily={MONO} fontWeight="700">A</text>
      {/* 寸法 */}
      <Dim ax={fOX} ay={fOY} bx={fOX+fW} by={fOY} val={OW} gap={-38} onEdit={v=>onDimChange&&onDimChange("width",v)}/>
      <Dim ax={fOX+fW} ay={fOY} bx={fOX+fW} by={fOY+fH} val={OH} gap={44} orient="v" onEdit={v=>onDimChange&&onDimChange("height",v)}/>

      {/* ── 平面図 ── */}
      {sortedComps.map((c,i)=><CompTop key={i} comp={c} ox={tOX} oy={tOY} sc={scT} totalD={OD}/>)}
      <OutlineRect x={tOX} y={tOY} w={tW} h={tD}/>
      <Dim ax={tOX} ay={tOY} bx={tOX+tW} by={tOY} val={OW} gap={-32} onEdit={v=>onDimChange&&onDimChange("width",v)}/>
      <Dim ax={tOX+tW} ay={tOY} bx={tOX+tW} by={tOY+tD} val={OD} gap={36} orient="v" onEdit={v=>onDimChange&&onDimChange("depth",v)}/>

      {/* ── 右側面図 ── */}
      {sortedComps.map((c,i)=><CompSide key={i} comp={c} ox={sOX} oy={sOY} sc={scS} totalH={OH}/>)}
      <OutlineRect x={sOX} y={sOY} w={sW} h={sH}/>
      <Dim ax={sOX} ay={sOY} bx={sOX+sW} by={sOY} val={OD} gap={-32} onEdit={v=>onDimChange&&onDimChange("depth",v)}/>
      <Dim ax={sOX+sW} ay={sOY} bx={sOX+sW} by={sOY+sH} val={OH} gap={36} orient="v" onEdit={v=>onDimChange&&onDimChange("height",v)}/>

      {/* 部品バルーン */}
      {comps.slice(0,6).map((c,i)=>{
        const bx=fOX + ((c.position?.x||0) + (c.width||0)/2)*scF;
        const by=fOY + (OH - (c.position?.y||0) - (c.height||0)/2)*scF;
        const lx=bx+15, ly=by-15;
        return <g key={i}>
          <line x1={bx} y1={by} x2={lx} y2={ly} stroke={C.dim} strokeWidth={0.5} strokeDasharray="3,2"/>
          <circle cx={lx+9} cy={ly-4} r={8} fill="white" stroke={C.dim} strokeWidth={0.7}/>
          <text x={lx+9} y={ly-1} textAnchor="middle" fill={C.dim} fontSize={7} fontFamily={MONO} fontWeight="700">{i+1}</text>
        </g>;
      })}

      {/* 表題欄 */}
      <rect x={14} y={SVG_H-TBH} width={SVG_W-28} height={TBH} fill="#f9f9f9" stroke="#333" strokeWidth={0.8}/>
      {[SVG_W*0.3,SVG_W*0.52,SVG_W*0.67,SVG_W*0.82].map(x=>(
        <line key={x} x1={x} y1={SVG_H-TBH} x2={x} y2={SVG_H-2} stroke="#ccc" strokeWidth={0.6}/>
      ))}
      {[
        [22,SVG_H-TBH+12,7,"#aaa","品名 / TITLE"],
        [22,SVG_H-TBH+30,13,"#111",furniture_name||"家具"],
        [SVG_W*0.3+8,SVG_H-TBH+12,7,"#aaa","材料 / MATERIAL"],
        [SVG_W*0.3+8,SVG_H-TBH+28,11,"#333",material||"—"],
        [SVG_W*0.3+8,SVG_H-TBH+44,7,"#888",`W${OW}×H${OH}×D${OD} mm`],
        [SVG_W*0.3+8,SVG_H-TBH+58,7,"#aaa","一般公差 ±0.5mm / 角度 ±0.5°"],
        [SVG_W*0.52+8,SVG_H-TBH+12,7,"#aaa","縮尺"],
        [SVG_W*0.52+8,SVG_H-TBH+28,10,"#333","1:10"],
        [SVG_W*0.67+8,SVG_H-TBH+12,7,"#aaa","図番"],
        [SVG_W*0.67+8,SVG_H-TBH+28,10,"#333",`AKS-${new Date().getFullYear()}-001`],
        [SVG_W*0.82+8,SVG_H-TBH+12,7,"#aaa","作成日"],
        [SVG_W*0.82+8,SVG_H-TBH+28,9,"#333",new Date().toLocaleDateString("ja-JP")],
        [SVG_W*0.82+8,SVG_H-TBH+50,8,"#888","赤 装 木 工 所"],
      ].map(([x,y,s,f,t],i)=>(
        <text key={i} x={x} y={y} fontSize={s} fill={f} fontFamily={SANS}>{t}</text>
      ))}
    </svg>
  );
}

// ══════════════════════════════════════════════════
// アイソメ 3D（SVG・コンポーネント駆動）
// ══════════════════════════════════════════════════
function Isometric3D({ data }) {
  if (!data) return null;
  const { overall_dimensions:od={}, components:comps=[] } = data;
  const OW=+od.width||800, OH=+od.height||750, OD=+od.depth||500;
  const sv = Math.min(300/OW, 300/OH, 300/OD);
  const C30=Math.cos(Math.PI/6), S30=Math.sin(Math.PI/6);
  const SW=600, SH=540;
  const cx=SW*0.38, cy=SH*0.72;

  const iso=(x,y,z)=>({
    x: cx + (x-z)*C30,
    y: cy - y + (x+z)*S30,
  });

  const woodColors = [
    ["#e8cfaa","#c8a070","#d4b480"],
    ["#d8e8c0","#a8c080","#c0d490"],
    ["#c8d8e8","#8098b8","#90a8c8"],
    ["#e8d8c0","#b8a070","#c8b080"],
    ["#d0c8e0","#9888b0","#b0a0c8"],
  ];

  const face=(pts,fill)=>{
    const d2=pts.map(([x,y,z])=>{const p=iso(x,y,z);return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;}).join(" ");
    return <polygon points={d2} fill={fill} stroke="#4a3520" strokeWidth={0.7} opacity={0.95}/>;
  };

  // 各部品を箱として描画（arc_panelは近似）
  const renderComp = (comp, idx) => {
    const { shape="rect", width:W=0, height:H=0, depth:D=0,
      position:pos={}, arc_radius } = comp;
    const x=(pos.x||0)*sv, y=(pos.y||0)*sv, z=(pos.z||0)*sv;
    const w=W*sv, h=H*sv, d=D*sv;
    const cols = woodColors[idx % woodColors.length];

    if (shape==="cylinder") {
      const r=w/2;
      // 近似：八角柱
      const n=8;
      const segs=[];
      for (let i=0;i<n;i++) {
        const a1=(i/n)*Math.PI*2, a2=((i+1)/n)*Math.PI*2;
        const x1c=x+r+r*Math.cos(a1), z1c=z+r+r*Math.sin(a1);
        const x2c=x+r+r*Math.cos(a2), z2c=z+r+r*Math.sin(a2);
        segs.push(face([[x1c,y,z1c],[x2c,y,z2c],[x2c,y+h,z2c],[x1c,y+h,z1c]],cols[0]));
      }
      return <g key={idx}>{segs}</g>;
    }

    if (shape==="arc_panel" && arc_radius) {
      const R=arc_radius*sv;
      const n=12, sa=(comp.arc_start_deg||180)*Math.PI/180, ea=(comp.arc_end_deg||360)*Math.PI/180;
      const segs=[];
      for (let i=0;i<n;i++) {
        const a1=sa+(ea-sa)*(i/n), a2=sa+(ea-sa)*((i+1)/n);
        const x1c=x+w/2+R*Math.cos(a1), z1c=z+d/2+R*Math.sin(a1);
        const x2c=x+w/2+R*Math.cos(a2), z2c=z+d/2+R*Math.sin(a2);
        segs.push(face([[x1c,y,z1c],[x2c,y,z2c],[x2c,y+h,z2c],[x1c,y+h,z1c]],cols[0]));
      }
      return <g key={idx}>{segs}</g>;
    }

    // 通常の直方体
    return <g key={idx}>
      {/* 上面 */}
      {face([[x,y+h,z],[x+w,y+h,z],[x+w,y+h,z+d],[x,y+h,z+d]],cols[0])}
      {/* 正面 */}
      {face([[x,y,z],[x+w,y,z],[x+w,y+h,z],[x,y+h,z]],cols[1])}
      {/* 右面 */}
      {face([[x+w,y,z],[x+w,y,z+d],[x+w,y+h,z+d],[x+w,y+h,z]],cols[2])}
    </g>;
  };

  // 寸法
  const ow=OW*sv, oh=OH*sv, od2=OD*sv, ext=18;
  const pA=iso(0,oh+ext,0), pB=iso(ow,oh+ext,0);
  const pC=iso(ow+ext,oh,0), pD=iso(ow+ext,0,0);
  const pE=iso(ow+ext,0,0), pF=iso(ow+ext,0,od2);

  return (
    <svg width={SW} height={SH} viewBox={`0 0 ${SW} ${SH}`}
      style={{background:"#fafafa",maxWidth:"100%",display:"block"}} xmlns="http://www.w3.org/2000/svg">
      {[...comps].sort((a,b)=>((b.position?.z||0)-(a.position?.z||0))).map((c,i)=>renderComp(c,i))}
      {/* 寸法線 */}
      <g>
        {[[iso(0,oh,0),pA],[iso(ow,oh,0),pB]].map(([f,t],i)=>(
          <line key={i} x1={f.x} y1={f.y} x2={t.x} y2={t.y} stroke={C.dim} strokeWidth={0.5}/>
        ))}
        <line x1={pA.x} y1={pA.y} x2={pB.x} y2={pB.y} stroke={C.dim} strokeWidth={0.8}/>
        <text x={(pA.x+pB.x)/2} y={(pA.y+pB.y)/2+11} textAnchor="middle" fill={C.dim} fontSize={9} fontFamily={MONO}>{OW}mm</text>
        {[[iso(ow,oh,0),pC],[iso(ow,0,0),pD]].map(([f,t],i)=>(
          <line key={i} x1={f.x} y1={f.y} x2={t.x} y2={t.y} stroke={C.dim} strokeWidth={0.5}/>
        ))}
        <line x1={pC.x} y1={pC.y} x2={pD.x} y2={pD.y} stroke={C.dim} strokeWidth={0.8}/>
        <text x={pC.x+9} y={(pC.y+pD.y)/2+3} fill={C.dim} fontSize={9} fontFamily={MONO}>{OH}mm</text>
        {[[iso(ow,0,0),pE],[iso(ow,0,od2),pF]].map(([f,t],i)=>(
          <line key={i} x1={f.x} y1={f.y} x2={t.x} y2={t.y} stroke={C.dim} strokeWidth={0.5}/>
        ))}
        <line x1={pE.x} y1={pE.y} x2={pF.x} y2={pF.y} stroke={C.dim} strokeWidth={0.8}/>
        <text x={(pE.x+pF.x)/2-6} y={(pE.y+pF.y)/2-5} fill={C.dim} fontSize={9} fontFamily={MONO}>{OD}mm</text>
      </g>
      <text x={14} y={20} fontSize={10} fill="#555" fontFamily={SANS} fontWeight="700">アイソメトリック図 — 等角投影</text>
    </svg>
  );
}

// ══════════════════════════════════════════════════
// インタラクティブ 3D（Canvas・完全修正版）
// ══════════════════════════════════════════════════
function Interactive3D({ data }) {
  const canvasRef = useRef(null);
  const stateRef  = useRef({ yaw: 0.55, pitch: 0.3 });
  const dragRef   = useRef(null);
  const rafRef    = useRef(null);

  // 有効な6桁HEXのみ受け付ける安全なブレンド関数
  const blendHex = (hex, light) => {
    const h = hex.replace(/[^0-9a-fA-F]/g,"");
    const full = h.length===3 ? h[0]+h[0]+h[1]+h[1]+h[2]+h[2] : h.slice(0,6).padEnd(6,"0");
    const r=parseInt(full.slice(0,2),16)||0;
    const g=parseInt(full.slice(2,4),16)||0;
    const b=parseInt(full.slice(4,6),16)||0;
    return `rgb(${Math.round(r*light)},${Math.round(g*light)},${Math.round(b*light)})`;
  };

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data) return;
    const ctx = canvas.getContext("2d");
    const CW = canvas.width, CH = canvas.height;

    ctx.fillStyle = "#0d1117";
    ctx.fillRect(0,0,CW,CH);

    const { overall_dimensions:od={}, components:comps=[] } = data;
    const OW=+od.width||800, OH=+od.height||750, OD=+od.depth||500;
    const sc = Math.min(CW,CH) / Math.max(OW,OH,OD) * 0.50;
    const { yaw, pitch } = stateRef.current;

    // 投影
    const proj = (x,y,z) => {
      const cx2=x-OW*sc/2, cy2=y-OH*sc/2, cz2=z-OD*sc/2;
      const rx =  cx2*Math.cos(yaw) + cz2*Math.sin(yaw);
      const rz1= -cx2*Math.sin(yaw) + cz2*Math.cos(yaw);
      const ry =  cy2*Math.cos(pitch) - rz1*Math.sin(pitch);
      const rz =  cy2*Math.sin(pitch) + rz1*Math.cos(pitch);
      const fov=900, zz=rz+fov;
      return { x: CW/2+rx*fov/zz, y: CH/2-ry*fov/zz, z: rz };
    };

    // ライト
    const ld = [0.4,-0.7,0.3];
    const lLen = Math.hypot(...ld);
    const lN = ld.map(v=>v/lLen);
    const lit = (nx,ny,nz) => {
      const dot = nx*lN[0]+ny*lN[1]+nz*lN[2];
      return Math.max(0.18, Math.min(1.0, 0.55+dot*0.45));
    };

    // フェイスリスト生成
    const faces = [];
    const palette = [
      ["c8a870","b89060","d4b480"],
      ["80a060","608040","90b470"],
      ["7090b8","506890","80a0c8"],
      ["b8a050","907830","c8b060"],
      ["9870b0","786090","b090c8"],
      ["709070","507050","80a880"],
    ];

    const addBox = (x,y,z,w,h,d,cols) => {
      if (w<=0||h<=0||d<=0) return;
      const X=x*sc, Y=y*sc, Z=z*sc;
      const W2=w*sc, H2=h*sc, D2=d*sc;
      const sides = [
        { v:[[X,Y,Z],[X+W2,Y,Z],[X+W2,Y+H2,Z],[X,Y+H2,Z]], n:[0,0,-1], ci:0 },
        { v:[[X,Y,Z+D2],[X+W2,Y,Z+D2],[X+W2,Y+H2,Z+D2],[X,Y+H2,Z+D2]], n:[0,0,1], ci:1 },
        { v:[[X+W2,Y,Z],[X+W2,Y,Z+D2],[X+W2,Y+H2,Z+D2],[X+W2,Y+H2,Z]], n:[1,0,0], ci:2 },
        { v:[[X,Y,Z],[X,Y,Z+D2],[X,Y+H2,Z+D2],[X,Y+H2,Z]], n:[-1,0,0], ci:0 },
        { v:[[X,Y+H2,Z],[X+W2,Y+H2,Z],[X+W2,Y+H2,Z+D2],[X,Y+H2,Z+D2]], n:[0,1,0], ci:1 },
        { v:[[X,Y,Z],[X+W2,Y,Z],[X+W2,Y,Z+D2],[X,Y,Z+D2]], n:[0,-1,0], ci:2 },
      ];
      sides.forEach(({v,n,ci})=>{
        const ps = v.map(([px,py,pz])=>proj(px,py,pz));
        const v1x=ps[1].x-ps[0].x, v1y=ps[1].y-ps[0].y;
        const v2x=ps[2].x-ps[0].x, v2y=ps[2].y-ps[0].y;
        if (v1x*v2y-v1y*v2x>=0) return;
        const avgZ=ps.reduce((s,p)=>s+p.z,0)/ps.length;
        const light=lit(...n);
        faces.push({ ps, color: blendHex(cols[ci], light), avgZ });
      });
    };

    comps.forEach((comp,idx)=>{
      const { shape="rect", width:w=0, height:h=0, depth:d=0, position:pos={} } = comp;
      const cols = palette[idx % palette.length];
      const x=pos.x||0, y=pos.y||0, z=pos.z||0;
      if (shape==="cylinder") {
        const r=w/2, n=10;
        for (let i=0;i<n;i++) {
          const a1=(i/n)*Math.PI*2, a2=((i+1)/n)*Math.PI*2;
          const x1c=x+r+r*Math.cos(a1), z1c=z+r+r*Math.sin(a1);
          const x2c=x+r+r*Math.cos(a2), z2c=z+r+r*Math.sin(a2);
          const nx=(Math.cos(a1)+Math.cos(a2))/2, nz=(Math.sin(a1)+Math.sin(a2))/2;
          const ps=[
            proj(x1c*sc,y*sc,z1c*sc), proj(x2c*sc,y*sc,z2c*sc),
            proj(x2c*sc,(y+h)*sc,z2c*sc), proj(x1c*sc,(y+h)*sc,z1c*sc),
          ];
          const v1x=ps[1].x-ps[0].x, v1y=ps[1].y-ps[0].y;
          const v2x=ps[2].x-ps[0].x, v2y=ps[2].y-ps[0].y;
          if (v1x*v2y-v1y*v2x<0) {
            const avgZ=ps.reduce((s,p)=>s+p.z,0)/ps.length;
            faces.push({ps, color:blendHex(cols[0],lit(nx,0,nz)), avgZ});
          }
        }
      } else {
        addBox(x,y,z,w,h,d,cols);
      }
    });

    // ペインタアルゴリズム
    faces.sort((a,b)=>a.avgZ-b.avgZ);
    faces.forEach(({ps,color})=>{
      ctx.beginPath();
      ctx.moveTo(ps[0].x, ps[0].y);
      for (let i=1;i<ps.length;i++) ctx.lineTo(ps[i].x, ps[i].y);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.06)";
      ctx.lineWidth = 0.5;
      ctx.stroke();
    });

    // グリッド床
    ctx.globalAlpha = 0.08;
    const gs = Math.min(OW,OD)*sc*0.12;
    for (let i=-6;i<=6;i++) {
      const p1=proj(OW*sc/2+i*gs, OH*sc,-OD*sc*0.3), p2=proj(OW*sc/2+i*gs, OH*sc, OD*sc*1.3);
      const p3=proj(-OW*sc*0.3, OH*sc, OD*sc/2+i*gs), p4=proj(OW*sc*1.3, OH*sc, OD*sc/2+i*gs);
      ctx.beginPath(); ctx.moveTo(p1.x,p1.y); ctx.lineTo(p2.x,p2.y);
      ctx.strokeStyle="#58a6ff"; ctx.lineWidth=0.5; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(p3.x,p3.y); ctx.lineTo(p4.x,p4.y); ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // 軸表示
    const origin = proj(OW*sc/2, OH*sc/2, OD*sc/2);
    const axisLen = Math.min(OW,OH,OD)*sc*0.18;
    [["X",[axisLen,0,0],"#f85149"],["Y",[0,-axisLen,0],"#3fb950"],["Z",[0,0,axisLen],"#58a6ff"]].forEach(([label,[dx,dy,dz],col])=>{
      const ep=proj(OW*sc/2+dx, OH*sc/2+dy, OD*sc/2+dz);
      ctx.beginPath(); ctx.moveTo(origin.x,origin.y); ctx.lineTo(ep.x,ep.y);
      ctx.strokeStyle=col; ctx.lineWidth=1.5; ctx.stroke();
      ctx.fillStyle=col; ctx.font="bold 11px monospace"; ctx.fillText(label,ep.x+3,ep.y+3);
    });

    ctx.fillStyle="#7d8590"; ctx.font="11px sans-serif";
    ctx.fillText("ドラッグ: 回転　タッチ操作対応",12,20);
  }, [data]);

  useEffect(()=>{
    draw();
    return ()=>{ if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  },[draw]);

  const getXY = e => {
    if (e.touches) { const t=e.touches[0]; return {x:t.clientX,y:t.clientY}; }
    return {x:e.clientX,y:e.clientY};
  };

  const onDown = e => {
    e.preventDefault();
    const {x,y}=getXY(e);
    dragRef.current = {x, y, ...stateRef.current};
  };
  const onMove = e => {
    e.preventDefault();
    if (!dragRef.current) return;
    const {x,y}=getXY(e);
    stateRef.current = {
      yaw:   dragRef.current.yaw   + (x-dragRef.current.x)*0.013,
      pitch: Math.max(-1.3, Math.min(1.3, dragRef.current.pitch + (y-dragRef.current.y)*0.013)),
    };
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(draw);
  };
  const onUp = () => { dragRef.current = null; };

  return (
    <canvas ref={canvasRef} width={580} height={500}
      style={{cursor:"grab",maxWidth:"100%",display:"block",borderRadius:6,touchAction:"none"}}
      onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
      onTouchStart={onDown} onTouchMove={onMove} onTouchEnd={onUp}/>
  );
}

// ══════════════════════════════════════════════════
// 部品表
// ══════════════════════════════════════════════════
function BOM({ data }) {
  if (!data?.components?.length) return <div style={{padding:40,textAlign:"center",color:C.sub}}>部品情報がありません</div>;
  const pcs=data.components.reduce((s,c)=>s+(+c.quantity||1),0);
  const area=data.components.reduce((s,c)=>s+((+c.width*(+c.depth||+c.height||0))/1e6)*(+c.quantity||1),0);
  const cols=["No.","部品名","形状","W","H","D","材種","木目","板厚","数量","接合","備考"];
  return <div>
    <div style={{overflowX:"auto"}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:11,fontFamily:SANS}}>
        <thead><tr style={{background:"#1c2128"}}>
          {cols.map(h=><th key={h} style={{padding:"9px 8px",textAlign:"left",color:C.sub,fontSize:9,fontWeight:600,borderBottom:`1px solid ${C.border2}`,whiteSpace:"nowrap"}}>{h}</th>)}
        </tr></thead>
        <tbody>
          {data.components.map((c,i)=>(
            <tr key={i} style={{borderBottom:`1px solid ${C.border}`,background:i%2?"#0d1117":"#161b22"}}>
              <td style={{padding:"7px 8px",color:C.accent,fontFamily:MONO,fontWeight:700}}>{String(i+1).padStart(2,"0")}</td>
              <td style={{padding:"7px 8px",fontWeight:600,color:C.text,whiteSpace:"nowrap"}}>{c.part_name}</td>
              <td style={{padding:"7px 8px"}}><span style={{fontSize:9,background:"#1c2128",padding:"2px 6px",borderRadius:3,color:C.ok}}>{c.shape||"rect"}</span></td>
              <td style={{padding:"7px 8px",color:"#79c0ff",fontFamily:MONO}}>{c.width}</td>
              <td style={{padding:"7px 8px",color:"#79c0ff",fontFamily:MONO}}>{c.height}</td>
              <td style={{padding:"7px 8px",color:"#79c0ff",fontFamily:MONO}}>{c.depth}</td>
              <td style={{padding:"7px 8px",color:C.warn}}>{c.material}</td>
              <td style={{padding:"7px 8px"}}><span style={{fontSize:9,background:"#21262d",padding:"2px 5px",borderRadius:3,color:C.sub}}>{c.grain_direction||"—"}</span></td>
              <td style={{padding:"7px 8px",color:"#79c0ff",fontFamily:MONO}}>{c.panel_thickness||"—"}</td>
              <td style={{padding:"7px 8px",fontFamily:MONO,fontWeight:600}}>{c.quantity}</td>
              <td style={{padding:"7px 8px",color:C.sub,fontSize:9}}>{c.joint_method||"—"}</td>
              <td style={{padding:"7px 8px",color:C.sub,fontSize:9}}>{c.notes||""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div style={{marginTop:12,display:"flex",gap:8,flexWrap:"wrap"}}>
      {[["総部品数",`${pcs} 点`,C.accent],["推定材料面積",`${area.toFixed(2)} m²`,C.ok],["主材",data.material||"—",C.warn]].map(([l,v,col])=>(
        <div key={l} style={{flex:1,minWidth:110,padding:"10px 14px",background:"#0d1117",border:`1px solid ${C.border2}`,borderRadius:6}}>
          <div style={{color:C.sub,fontSize:10,marginBottom:3}}>{l}</div>
          <div style={{color:col,fontSize:15,fontWeight:700,fontFamily:MONO}}>{v}</div>
        </div>
      ))}
    </div>
  </div>;
}

// ══════════════════════════════════════════════════
// かんたん編集（アナログ対応フォームUI）
// ══════════════════════════════════════════════════
function EasyEditor({ data, onApply }) {
  const [d, setD] = useState(() => JSON.parse(JSON.stringify(data)));

  // data が外側から変わったら同期
  useEffect(() => {
    setD(JSON.parse(JSON.stringify(data)));
  }, [data]);

  const setField = (path, val) => {
    setD(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      const keys = path.split(".");
      let cur = next;
      for (let i=0; i<keys.length-1; i++) cur = cur[keys[i]];
      cur[keys[keys.length-1]] = val;
      return next;
    });
  };

  const setCompField = (idx, key, val) => {
    setD(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      next.components[idx][key] = val;
      return next;
    });
  };

  const addPart = () => {
    setD(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      next.components.push({
        part_name: "新しい部品",
        shape: "rect",
        width: 100, height: 100, depth: 20,
        panel_thickness: 20,
        position: { x: 0, y: 0, z: 0 },
        material: next.material || "",
        grain_direction: "横目",
        quantity: 1,
        joint_method: "",
        notes: ""
      });
      return next;
    });
  };

  const removePart = (idx) => {
    setD(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      next.components.splice(idx, 1);
      return next;
    });
  };

  const movePart = (idx, dir) => {
    setD(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      const comps = next.components;
      const target = idx + dir;
      if (target < 0 || target >= comps.length) return next;
      [comps[idx], comps[target]] = [comps[target], comps[idx]];
      return next;
    });
  };

  const labelStyle = { fontSize: 11, color: "#7d8590", marginBottom: 3, display: "block" };
  const inputStyle = {
    width: "100%", padding: "7px 10px", background: "#0d1117",
    border: `1px solid ${C.border2}`, borderRadius: 5,
    color: C.text, fontSize: 12, fontFamily: SANS, outline: "none",
    boxSizing: "border-box"
  };
  const numInputStyle = {
    ...inputStyle, width: "100%", fontFamily: MONO, color: "#79c0ff", textAlign: "right"
  };
  const sectionStyle = {
    background: C.panel, border: `1px solid ${C.border}`,
    borderRadius: 8, padding: "16px 18px", marginBottom: 14
  };

  return (
    <div style={{ maxWidth: 700 }}>
      {/* 家具の基本情報 */}
      <div style={sectionStyle}>
        <div style={{ fontSize: 13, fontWeight: 800, color: C.accent, marginBottom: 14, letterSpacing: 1 }}>
          📋 家具の基本情報
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
          <div>
            <label style={labelStyle}>家具名</label>
            <input style={inputStyle} value={d.furniture_name || ""}
              onChange={e => setField("furniture_name", e.target.value)} placeholder="例：ダイニングテーブル"/>
          </div>
          <div>
            <label style={labelStyle}>材種</label>
            <input style={inputStyle} value={d.material || ""}
              onChange={e => setField("material", e.target.value)} placeholder="例：オーク無垢材"/>
          </div>
        </div>
        <div>
          <label style={labelStyle}>仕上げ</label>
          <input style={inputStyle} value={d.finish || ""}
            onChange={e => setField("finish", e.target.value)} placeholder="例：オイル仕上げ"/>
        </div>
      </div>

      {/* 全体寸法 */}
      <div style={sectionStyle}>
        <div style={{ fontSize: 13, fontWeight: 800, color: C.accent, marginBottom: 14, letterSpacing: 1 }}>
          📐 全体寸法（mm）
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          {[["幅（W）", "overall_dimensions.width"], ["高さ（H）", "overall_dimensions.height"], ["奥行き（D）", "overall_dimensions.depth"]].map(([label, path]) => (
            <div key={path}>
              <label style={labelStyle}>{label}</label>
              <input type="number" style={numInputStyle}
                value={path.split(".").reduce((o,k)=>o?.[k],d) || ""}
                onChange={e => setField(path, +e.target.value)}/>
            </div>
          ))}
        </div>
      </div>

      {/* 部品リスト */}
      <div style={sectionStyle}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: C.accent, letterSpacing: 1 }}>
            🔩 部品リスト（{d.components?.length || 0}点）
          </div>
          <button onClick={addPart}
            style={{ padding: "6px 14px", background: C.ok, color: "#000", border: "none", borderRadius: 5, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
            ＋ 部品を追加
          </button>
        </div>

        {(d.components || []).map((comp, idx) => (
          <div key={idx} style={{
            background: "#0d1117", border: `1px solid ${C.border2}`, borderRadius: 7,
            padding: "12px 14px", marginBottom: 10, position: "relative"
          }}>
            {/* 部品番号・並び替え・削除 */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <div style={{
                width: 24, height: 24, background: C.accent2, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 10, fontWeight: 700, color: "#fff", flexShrink: 0
              }}>{idx + 1}</div>
              <input style={{ ...inputStyle, flex: 1, fontWeight: 700, fontSize: 13 }}
                value={comp.part_name || ""}
                onChange={e => setCompField(idx, "part_name", e.target.value)}
                placeholder="部品名"/>
              <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                <button onClick={() => movePart(idx, -1)} disabled={idx === 0}
                  style={{ padding: "3px 7px", background: "#21262d", border: `1px solid ${C.border2}`, borderRadius: 4, color: idx===0?"#444":C.sub, cursor: idx===0?"default":"pointer", fontSize: 11 }}>↑</button>
                <button onClick={() => movePart(idx, 1)} disabled={idx === (d.components.length-1)}
                  style={{ padding: "3px 7px", background: "#21262d", border: `1px solid ${C.border2}`, borderRadius: 4, color: idx===(d.components.length-1)?"#444":C.sub, cursor: idx===(d.components.length-1)?"default":"pointer", fontSize: 11 }}>↓</button>
                <button onClick={() => removePart(idx)}
                  style={{ padding: "3px 9px", background: "#2d0000", border: `1px solid ${C.err}`, borderRadius: 4, color: C.err, cursor: "pointer", fontSize: 11, fontWeight: 700 }}>✕</button>
              </div>
            </div>

            {/* 寸法・数量 */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", gap: 8 }}>
              {[["幅 W", "width"], ["高さ H", "height"], ["奥行 D", "depth"], ["板厚", "panel_thickness"], ["数量", "quantity"]].map(([label, key]) => (
                <div key={key}>
                  <label style={{ ...labelStyle, fontSize: 10 }}>{label}</label>
                  <input type="number" style={{ ...numInputStyle, fontSize: 11 }}
                    value={comp[key] || ""}
                    onChange={e => setCompField(idx, key, +e.target.value)}/>
                </div>
              ))}
            </div>

            {/* 材種・木目・接合 */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 8 }}>
              <div>
                <label style={{ ...labelStyle, fontSize: 10 }}>材種</label>
                <input style={{ ...inputStyle, fontSize: 11 }} value={comp.material || ""}
                  onChange={e => setCompField(idx, "material", e.target.value)}/>
              </div>
              <div>
                <label style={{ ...labelStyle, fontSize: 10 }}>木目方向</label>
                <select style={{ ...inputStyle, fontSize: 11 }} value={comp.grain_direction || "横目"}
                  onChange={e => setCompField(idx, "grain_direction", e.target.value)}>
                  <option>横目</option>
                  <option>縦目</option>
                </select>
              </div>
              <div>
                <label style={{ ...labelStyle, fontSize: 10 }}>接合方法</label>
                <input style={{ ...inputStyle, fontSize: 11 }} value={comp.joint_method || ""}
                  onChange={e => setCompField(idx, "joint_method", e.target.value)}
                  placeholder="ほぞ・ビス・ダボ…"/>
              </div>
            </div>

            {/* 備考 */}
            <div style={{ marginTop: 8 }}>
              <label style={{ ...labelStyle, fontSize: 10 }}>備考</label>
              <input style={{ ...inputStyle, fontSize: 11 }} value={comp.notes || ""}
                onChange={e => setCompField(idx, "notes", e.target.value)}
                placeholder="特記事項があれば"/>
            </div>
          </div>
        ))}
      </div>

      {/* 反映ボタン */}
      <button onClick={() => onApply(d)}
        style={{
          width: "100%", padding: "13px", background: C.accent2,
          color: "#fff", border: "none", borderRadius: 7,
          fontSize: 14, fontWeight: 800, cursor: "pointer", letterSpacing: 1,
          marginBottom: 30
        }}>
        この内容で図面を更新する
      </button>
    </div>
  );
}


// ステップ1：画像観察プロンプト
const PROMPT_OBSERVE = `この画像に描かれている家具・造作物を観察して、以下の項目を具体的に答えてください。

【最優先：寸法数値の読み取り】
画像に数字や寸法（例：W1400、H720、60角、t30など）が書かれていれば、必ずすべて読み取って報告してください。
手書きの数字でも読める限り読んでください。これらは後の図面生成で最優先で使用します。

【必須項目】
1. 家具の種類（テーブル／棚／椅子／カウンター／建具 など）
2. 脚の本数と断面形状（角材／丸脚）、およびおおよその太さ
3. 天板・棚板・座面の枚数と厚み
4. 幕板（天板と脚をつなぐ横板）の有無
5. 全体の幅：高さ：奥行きの比率（例：幅が高さの2倍、奥行きは幅の半分）
6. 曲線・円弧・R加工などの有無と場所
7. 棚がある場合、段数と間隔

画像に見えるものだけ答えてください。見えないものは「不明」と書いてください。`;

// ステップ2：JSON変換プロンプト（観察結果を渡す）
const makePromptJSON = (observation) => {
  return `以下の観察記録から家具のJSONを生成してください。JSONのみ返答（前後に説明文不要）。

【観察記録】
${observation}

【座標ルール】※最重要
- 原点(0,0,0) = 家具の左・下・手前の角
- x軸 = 右方向（幅）、y軸 = 上方向（高さ）、z軸 = 奥方向（奥行き）
- position は各部品の「左下手前の角」の座標

【テーブル・脚物家具の場合の必須ルール】
- 脚は必ず1本ずつ独立したcomponentとして記述する（まとめてはいけない）
- 脚4本の場合：前脚左(x=内側オフセット, z=内側オフセット)、前脚右(x=W-脚幅-オフセット, z=内側オフセット)、後脚左(x=内側オフセット, z=D-脚幅-オフセット)、後脚右(x=W-脚幅-オフセット, z=D-脚幅-オフセット)
- 天板はy=全高さ-天板厚、幕板は脚の上端付近に配置

【棚・キャビネットの場合】
- 側板2枚、天板、底板、各棚板を個別に記述する

【サイズの目安】
テーブル：W1200-1800, H700-750, D800-900
椅子：W450, H800(座面H430), D450
棚：W900, H1800, D350
カウンター：W1800, H900, D600

出力形式：
{
  "furniture_name": "名称",
  "material": "材種",
  "finish": "仕上げ",
  "overall_dimensions": { "width": 数値, "height": 数値, "depth": 数値 },
  "components": [
    {
      "part_name": "部品名（前脚左／天板／側板左 など具体的に）",
      "shape": "rect",
      "width": 数値,
      "height": 数値,
      "depth": 数値,
      "panel_thickness": 数値,
      "position": { "x": 数値, "y": 数値, "z": 数値 },
      "material": "材種",
      "grain_direction": "横目",
      "quantity": 1,
      "joint_method": "ほぞ",
      "notes": ""
    }
  ]
}`;
};
// ══════════════════════════════════════════════════
// MAIN APP
// ══════════════════════════════════════════════════
const TEST_TABLE = {
  furniture_name:"ダイニングテーブル（テスト）", material:"オーク無垢材", finish:"オイル仕上げ",
  overall_dimensions:{width:1400,height:720,depth:800},
  components:[
    {part_name:"天板",shape:"rect",width:1400,height:40,depth:800,panel_thickness:40,position:{x:0,y:680,z:0},material:"オーク",grain_direction:"横目",quantity:1,joint_method:"ビス",notes:""},
    {part_name:"幕板・長手前",shape:"rect",width:1260,height:100,depth:30,panel_thickness:30,position:{x:70,y:580,z:15},material:"オーク",grain_direction:"横目",quantity:1,joint_method:"ほぞ",notes:""},
    {part_name:"幕板・長手後",shape:"rect",width:1260,height:100,depth:30,panel_thickness:30,position:{x:70,y:580,z:755},material:"オーク",grain_direction:"横目",quantity:1,joint_method:"ほぞ",notes:""},
    {part_name:"幕板・短手左",shape:"rect",width:30,height:100,depth:740,panel_thickness:30,position:{x:70,y:580,z:30},material:"オーク",grain_direction:"横目",quantity:1,joint_method:"ほぞ",notes:""},
    {part_name:"幕板・短手右",shape:"rect",width:30,height:100,depth:740,panel_thickness:30,position:{x:1300,y:580,z:30},material:"オーク",grain_direction:"横目",quantity:1,joint_method:"ほぞ",notes:""},
    {part_name:"前脚左",shape:"rect",width:60,height:680,depth:60,panel_thickness:60,position:{x:50,y:0,z:20},material:"オーク",grain_direction:"縦目",quantity:1,joint_method:"ほぞ",notes:""},
    {part_name:"前脚右",shape:"rect",width:60,height:680,depth:60,panel_thickness:60,position:{x:1290,y:0,z:20},material:"オーク",grain_direction:"縦目",quantity:1,joint_method:"ほぞ",notes:""},
    {part_name:"後脚左",shape:"rect",width:60,height:680,depth:60,panel_thickness:60,position:{x:50,y:0,z:720},material:"オーク",grain_direction:"縦目",quantity:1,joint_method:"ほぞ",notes:""},
    {part_name:"後脚右",shape:"rect",width:60,height:680,depth:60,panel_thickness:60,position:{x:1290,y:0,z:720},material:"オーク",grain_direction:"縦目",quantity:1,joint_method:"ほぞ",notes:""},
  ]
};

export default function App() {
  const [image,    setImage]    = useState(null);
  const [imgB64,   setImgB64]   = useState(null);
  const [imgType,  setImgType]  = useState("image/jpeg");
  const [data,     setData]     = useState(null);
  const [rawJson,  setRawJson]  = useState("");
  const [jsonEdit, setJsonEdit] = useState("");
  const [jsonErr,  setJsonErr]  = useState("");
  const [loading,  setLoading]  = useState(false);
  const [loadStep, setLoadStep] = useState("");
  const [error,    setError]    = useState(null);
  const [tab,      setTab]      = useState("2d");
  const [sub3d,    setSub3d]    = useState("iso");
  const [dragging, setDragging] = useState(false);
  const svgRef  = useRef(null);
  const fileRef = useRef(null);

  const applyJson = (str) => {
    try {
      const parsed = JSON.parse(str);
      setData(parsed); setJsonErr(""); setTab("2d");
    } catch(e) { setJsonErr(e.message); }
  };

  const processFile = useCallback(file=>{
    if (!file) return;
    const type=file.type||"";
    if (!type.startsWith("image/") && !file.name?.match(/\.(jpe?g|png|webp)$/i)) {
      setError("JPEG / PNG / WebP の画像ファイルを選択してください"); return;
    }
    const reader = new FileReader();
    reader.onload = e => {
      const url = e.target.result;
      const m = url.match(/^data:([^;]+);base64,(.+)$/);
      if (!m) { setError("画像の読み込みに失敗しました"); return; }
      const safe = ["image/jpeg","image/png","image/gif","image/webp"].includes(m[1]) ? m[1] : "image/jpeg";
      setImage(url); setImgB64(m[2]); setImgType(safe);
      setData(null); setError(null);
    };
    reader.onerror = () => setError("ファイル読み込みエラー");
    reader.readAsDataURL(file);
  }, []);

  const analyze = async () => {
    if (!imgB64) return;
    setLoading(true); setLoadStep("画像を観察中…"); setError(null);
    try {
      const call = async (messages, maxTokens=1500) => {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: maxTokens,
            messages,
          })
        });
        const json = await res.json();
        if (!res.ok) throw new Error("API " + res.status + ": " + (json.error?.message || JSON.stringify(json)));
        return (json.content||[]).find(b=>b.type==="text")?.text || "";
      };

      // ── ステップ1：画像を観察・記述させる ──
      const observation = await call([{
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: imgType, data: imgB64 }},
          { type: "text",  text: PROMPT_OBSERVE }
        ]
      }], 1000);

      setLoadStep("図面データを生成中…");
      // ── ステップ2：観察結果をJSONに変換（画像なし） ──
      const jsonText = await call([{
        role: "user",
        content: [{ type: "text", text: makePromptJSON(observation) }]
      }], 2500);

      const m = jsonText.match(/\{[\s\S]*\}/);
      if (!m) throw new Error("JSON取得失敗。返答: " + jsonText.slice(0,300));
      const parsed = JSON.parse(m[0]);
      const pretty = JSON.stringify(parsed, null, 2);
      setRawJson(pretty); setJsonEdit(pretty);
      setData(parsed);
      setTab("2d");
    } catch(e) { setError(e.message||"不明なエラー"); }
    setLoading(false); setLoadStep("");
  };

  const downloadSVG = () => {
    if (!svgRef.current) return;
    const xml = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([xml],{type:"image/svg+xml;charset=utf-8"});
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${data?.furniture_name||"図面"}_JIS.svg`;
    a.click();
  };

  const downloadPDF = () => {
    if (!svgRef.current) return;
    const xml = new XMLSerializer().serializeToString(svgRef.current);
    const svgBlob = new Blob([xml], {type:"image/svg+xml;charset=utf-8"});
    const url = URL.createObjectURL(svgBlob);
    const win = window.open("","_blank");
    win.document.write(`<!DOCTYPE html><html><head>
      <title>${data?.furniture_name||"図面"}</title>
      <style>
        @page { size: A3 landscape; margin: 10mm; }
        body { margin:0; padding:0; display:flex; justify-content:center; align-items:center; min-height:100vh; background:#fff; }
        img { max-width:100%; max-height:100vh; }
        @media print { body { min-height:unset; } }
      </style>
    </head><body>
      <img src="${url}" onload="window.print();"/>
    </body></html>`);
    win.document.close();
  };

  const handleDimChange = (key, val) => {
    if (!data) return;
    const updated = {
      ...data,
      overall_dimensions: { ...data.overall_dimensions, [key]: val }
    };
    setData(updated);
    const s = JSON.stringify(updated, null, 2);
    setRawJson(s); setJsonEdit(s);
  };

  const TABS = [
    { key:"2d",    label:"2D図面（JIS）" },
    { key:"3d",    label:"3Dモデル" },
    { key:"bom",   label:"部品表" },
    { key:"edit",  label:"✏️ かんたん編集" },
    { key:"json",  label:"JSON（上級者向け）" },
  ];

  const od = data?.overall_dimensions || {};

  return (
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:SANS,color:C.text}}>
      {/* ヘッダー */}
      <div style={{background:C.panel,borderBottom:`1px solid ${C.border}`,padding:"11px 20px",display:"flex",alignItems:"center",gap:16}}>
        <div>
          <div style={{fontSize:17,fontWeight:900,letterSpacing:6}}>赤 装</div>
          <div style={{fontSize:8,color:C.sub,letterSpacing:2,marginTop:1}}>MOKKOUJYO — PROFESSIONAL DRAWING SYSTEM v12</div>
        </div>
        <div style={{width:1,height:30,background:C.border2}}/>
        <div style={{fontSize:10,color:C.sub}}>汎用コンポーネント方式 | 曲線対応 | JIS B 0001 第三角法</div>
        {data && (
          <div style={{marginLeft:"auto",display:"flex",gap:8}}>
            <button onClick={downloadPDF} style={{padding:"6px 16px",background:"#d73a49",color:"#fff",border:"none",borderRadius:5,fontSize:11,fontWeight:600,cursor:"pointer"}}>
              PDFダウンロード
            </button>
            <button onClick={downloadSVG} style={{padding:"6px 16px",background:C.accent2,color:"#fff",border:"none",borderRadius:5,fontSize:11,fontWeight:600,cursor:"pointer"}}>
              SVGダウンロード
            </button>
          </div>
        )}
      </div>

      <div style={{display:"flex",minHeight:"calc(100vh - 52px)"}}>
        {/* サイドバー */}
        <div style={{width:215,background:C.panel,borderRight:`1px solid ${C.border}`,padding:14,flexShrink:0,display:"flex",flexDirection:"column",gap:10,overflowY:"auto"}}>
          {/* アップロード */}
          <div
            onDragOver={e=>{e.preventDefault();setDragging(true);}}
            onDragLeave={()=>setDragging(false)}
            onDrop={e=>{e.preventDefault();setDragging(false);processFile(e.dataTransfer.files[0]);}}
            onClick={()=>fileRef.current?.click()}
            style={{border:`1.5px dashed ${dragging?C.accent:C.border2}`,borderRadius:8,padding:14,textAlign:"center",cursor:"pointer",background:dragging?"#1c2128":"#0d1117",minHeight:130,display:"flex",alignItems:"center",justifyContent:"center",transition:"all .15s"}}
          >
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" style={{display:"none"}} onChange={e=>processFile(e.target.files[0])}/>
            {image
              ? <img src={image} alt="" style={{maxWidth:"100%",maxHeight:150,borderRadius:4,objectFit:"contain"}}/>
              : <div>
                  <div style={{fontSize:24,marginBottom:6}}>🖊️</div>
                  <div style={{fontSize:11,fontWeight:600,color:C.sub}}>スケッチをアップロード</div>
                  <div style={{fontSize:9,color:"#555",marginTop:3}}>JPEG / PNG / WebP</div>
                </div>
            }
          </div>

          {image && !loading && (
            <button onClick={analyze} style={{width:"100%",padding:"10px",background:C.accent2,color:"#fff",border:"none",borderRadius:6,fontSize:12,fontWeight:700,cursor:"pointer",letterSpacing:1}}>
              図面生成
            </button>
          )}
          <button onClick={()=>{const s=JSON.stringify(TEST_TABLE,null,2);setData(TEST_TABLE);setRawJson(s);setJsonEdit(s);setTab("2d");}}
            style={{width:"100%",padding:"7px",background:"#21262d",color:C.sub,border:`1px solid ${C.border2}`,borderRadius:6,fontSize:10,cursor:"pointer"}}>
            テストデータ（テーブル）
          </button>

          {loading && (
            <div style={{textAlign:"center",padding:14}}>
              <div style={{display:"inline-block",width:24,height:24,border:`2px solid ${C.border2}`,borderTopColor:C.accent,borderRadius:"50%",animation:"spin .7s linear infinite"}}/>
              <div style={{fontSize:9,color:C.sub,marginTop:8}}>{loadStep||"AI解析中…"}</div>
            </div>
          )}

          {error && (
            <div style={{padding:10,background:"#2d0000",border:`1px solid ${C.err}`,borderRadius:6,color:C.err,fontSize:10,lineHeight:1.6,wordBreak:"break-all"}}>
              {error}
            </div>
          )}

          {data && (
            <div style={{borderTop:`1px solid ${C.border}`,paddingTop:12,marginTop:4}}>
              <div style={{fontSize:10,color:C.sub,marginBottom:4}}>解析結果</div>
              <div style={{fontSize:13,fontWeight:800,marginBottom:2}}>{data.furniture_name}</div>
              <div style={{fontSize:10,color:C.warn,marginBottom:8}}>{data.material}</div>
              {[["W",od.width],["H",od.height],["D",od.depth]].map(([l,v])=>(
                <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:`1px solid ${C.border}`}}>
                  <span style={{fontSize:10,color:C.sub}}>{l}</span>
                  <span style={{fontSize:10,color:C.accent,fontFamily:MONO}}>{v} mm</span>
                </div>
              ))}
              <div style={{marginTop:8,fontSize:10,color:C.sub}}>{data.components?.length||0}部品</div>
              {data.finish && <div style={{fontSize:10,color:C.sub,marginTop:2}}>{data.finish}</div>}
            </div>
          )}
        </div>

        {/* メインエリア */}
        <div style={{flex:1,padding:20,overflow:"auto"}}>
          {!data && !loading && (
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"75vh"}}>
              <div style={{textAlign:"center",color:C.sub}}>
                <div style={{fontSize:36,marginBottom:14,opacity:0.15}}>📐</div>
                <div style={{fontSize:14,fontWeight:700,letterSpacing:2,marginBottom:10}}>あらゆる家具・造作に対応</div>
                <div style={{fontSize:11,lineHeight:2.2,opacity:0.7}}>
                  テーブル・椅子・棚・カウンター・建具・造作家具<br/>
                  丸脚（cylinder）/ 曲線パネル（arc_panel）対応<br/>
                  JIS B 0001 第三角法 | アイソメ3D | インタラクティブ3D<br/>
                  部品番号 · 木目方向 · 接合方法 · 部品表
                </div>
              </div>
            </div>
          )}

          {data && (
            <>
              <div style={{display:"flex",gap:0,marginBottom:16,background:C.panel,borderRadius:6,overflow:"hidden",border:`1px solid ${C.border}`,width:"fit-content"}}>
                {TABS.map(t=>(
                  <button key={t.key} onClick={()=>setTab(t.key)}
                    style={{padding:"9px 20px",border:"none",background:tab===t.key?C.accent2:"none",color:tab===t.key?"#fff":C.sub,fontFamily:SANS,fontSize:11,fontWeight:600,cursor:"pointer",transition:"all .15s"}}>
                    {t.label}
                  </button>
                ))}
              </div>

              {tab==="2d" && (
                <div style={{overflowX:"auto"}}>
                  <Drawing2D data={data} svgRef={svgRef} onDimChange={handleDimChange}/>
                </div>
              )}

              {tab==="3d" && (
                <div>
                  <div style={{display:"flex",gap:8,marginBottom:12}}>
                    {[["iso","アイソメ（印刷用）"],["interactive","インタラクティブ（回転）"]].map(([k,l])=>(
                      <button key={k} onClick={()=>setSub3d(k)}
                        style={{padding:"6px 14px",border:`1px solid ${sub3d===k?C.accent:C.border2}`,background:sub3d===k?"#1c2d4a":C.panel,color:sub3d===k?C.accent:C.sub,borderRadius:4,fontSize:11,cursor:"pointer",fontFamily:SANS}}>
                        {l}
                      </button>
                    ))}
                  </div>
                  {sub3d==="iso"         && <Isometric3D    data={data}/>}
                  {sub3d==="interactive" && <Interactive3D  data={data}/>}
                </div>
              )}

              {tab==="bom" && <BOM data={data}/>}

              {tab==="edit" && (
                <EasyEditor data={data} onApply={edited => {
                  const pretty = JSON.stringify(edited, null, 2);
                  setData(edited);
                  setRawJson(pretty);
                  setJsonEdit(pretty);
                  setTab("2d");
                }}/>
              )}

              {tab==="json" && (
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  <div style={{fontSize:11,color:C.sub}}>AIが返したJSONを確認・編集できます。修正後「この内容で図面生成」ボタンで反映。</div>
                  <textarea
                    value={jsonEdit}
                    onChange={e=>{setJsonEdit(e.target.value);setJsonErr("");}}
                    style={{width:"100%",minHeight:420,background:"#0d1117",color:"#7ee787",fontFamily:MONO,fontSize:11,border:`1px solid ${C.border2}`,borderRadius:6,padding:12,resize:"vertical",boxSizing:"border-box"}}
                  />
                  {jsonErr && <div style={{color:C.err,fontSize:11}}>{jsonErr}</div>}
                  <div style={{display:"flex",gap:8}}>
                    <button onClick={()=>applyJson(jsonEdit)}
                      style={{padding:"8px 20px",background:C.ok,color:"#000",border:"none",borderRadius:5,fontSize:12,fontWeight:700,cursor:"pointer"}}>
                      この内容で図面生成
                    </button>
                    <button onClick={()=>setJsonEdit(rawJson)}
                      style={{padding:"8px 14px",background:"#21262d",color:C.sub,border:`1px solid ${C.border2}`,borderRadius:5,fontSize:11,cursor:"pointer"}}>
                      元に戻す
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
