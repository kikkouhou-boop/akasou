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
// pass="fill"  → 塗りのみ描画（輪郭線なし）
// pass="stroke"→ 輪郭線のみ描画（塗りなし）
function CompFront({ comp, ox,oy, sc, totalH, pass="fill" }) {
  const { shape="rect", width:W=0, height:H=0, depth:D=0,
    position:pos={}, grain_direction, arc_radius, arc_start_deg, arc_end_deg,
    is_hidden, part_name="", chiri=0 } = comp;
  const px = (pos.x||0)*sc + ox;
  const py = oy + (totalH - (pos.y||0) - H)*sc;
  const w = W*sc, h = H*sc;

  if (is_hidden) return null;

  const isDoor   = (part_name||"").includes("扉") || (part_name||"").includes("ドア");
  const isLeftDoor  = isDoor && (part_name||"").includes("左");
  const isRightDoor = isDoor && (part_name||"").includes("右");
  const isSingleDoor = isDoor && !isLeftDoor && !isRightDoor; // 旧形式の互換
  const isDrawer = (part_name||"").includes("引き出し") || (part_name||"").includes("ドロワー");

  const fill   = pass==="fill"   ? (isDrawer?"#cdd4c0" : "#e0d8c8") : "none";
  const stroke = pass==="stroke" ? "#333" : "none";
  const sw     = pass==="stroke" ? 0.8 : 0;

  if (shape==="cylinder") {
    const r = (W/2)*sc;
    return <g>
      <ellipse cx={px+r} cy={py+h} rx={r} ry={r*0.3} fill={fill} stroke={stroke} strokeWidth={sw}/>
      <rect x={px} y={py} width={w} height={h} fill={fill} stroke={stroke} strokeWidth={sw}/>
      <ellipse cx={px+r} cy={py} rx={r} ry={r*0.3} fill={fill} stroke={stroke} strokeWidth={sw}/>
    </g>;
  }
  if (shape==="arc_panel" && arc_radius) {
    const R = arc_radius*sc;
    const sa = arc_start_deg||180, ea = arc_end_deg||360;
    const cxA = px + w/2, cyA = py;
    return <g>
      <path d={arcPath(cxA,cyA,R,sa,ea)} fill="none" stroke={stroke} strokeWidth={sw}/>
      <path d={arcPath(cxA,cyA,R-h,sa,ea)} fill="none" stroke={stroke} strokeWidth={sw*0.7} strokeDasharray="3,2"/>
    </g>;
  }
  return <g>
    <rect x={px} y={py} width={Math.max(w,1)} height={Math.max(h,1)} fill={fill} stroke={stroke} strokeWidth={sw}/>
    {/* 扉描画：左扉・右扉・旧形式（互換）それぞれ独立描画 */}
    {isDoor && pass==="stroke" && <>
      {/* ちり（散り）：内側に破線矩形で段差を表現 */}
      {chiri > 0 && (() => {
        const cp = Math.max(chiri * sc, 3);
        const rw = Math.max(0, w - cp*2);
        const rh = Math.max(0, h - cp*2);
        if (rw < 1 || rh < 1) return null;
        return <>
          <rect x={px+cp} y={py+cp} width={rw} height={rh}
            fill="none" stroke="#777" strokeWidth={0.7} strokeDasharray="3,2" opacity={0.8}/>
          {!isLeftDoor && (
            <text x={px+w/2} y={py-4} textAnchor="middle" fill="#888" fontSize={7} fontFamily={MONO}>ちり {chiri}mm</text>
          )}
        </>;
      })()}
      {/* 左扉（◁）：右端→左中央 */}
      {isLeftDoor && <>
        <line x1={px+w} y1={py}   x2={px} y2={py+h/2} stroke="#444" strokeWidth={0.7}/>
        <line x1={px+w} y1={py+h} x2={px} y2={py+h/2} stroke="#444" strokeWidth={0.7}/>
      </>}
      {/* 右扉（▷）：左端に仕切り線（はみ出しなし）＋左端→右中央 */}
      {isRightDoor && <>
        <line x1={px} y1={py} x2={px} y2={py+h} stroke="#444" strokeWidth={0.8}/>
        <line x1={px} y1={py}   x2={px+w} y2={py+h/2} stroke="#444" strokeWidth={0.7}/>
        <line x1={px} y1={py+h} x2={px+w} y2={py+h/2} stroke="#444" strokeWidth={0.7}/>
      </>}
      {/* 旧形式（quantity/互換）：中央線＋両側三角 */}
      {isSingleDoor && <>
        <line x1={px+w/2} y1={py}   x2={px+w/2} y2={py+h}   stroke="#444" strokeWidth={0.8}/>
        <line x1={px+w/2} y1={py}   x2={px}     y2={py+h/2} stroke="#444" strokeWidth={0.7}/>
        <line x1={px+w/2} y1={py+h} x2={px}     y2={py+h/2} stroke="#444" strokeWidth={0.7}/>
        <line x1={px+w/2} y1={py}   x2={px+w}   y2={py+h/2} stroke="#444" strokeWidth={0.7}/>
        <line x1={px+w/2} y1={py+h} x2={px+w}   y2={py+h/2} stroke="#444" strokeWidth={0.7}/>
      </>}
    </>}
    {/* 引き出し：水平線3本 */}
    {isDrawer && pass==="stroke" && [0.3,0.5,0.7].map((r,i)=>
      <line key={i} x1={px+4} y1={py+h*r} x2={px+w-4} y2={py+h*r} stroke="#666" strokeWidth={0.5}/>
    )}
    {pass==="fill" && !isDoor && !isDrawer && grain_direction && <Grain x={px} y={py} w={w} h={h} dir={grain_direction==="縦目"?"v":"h"}/>}
  </g>;
}

// 1部品のSVG描画（側面図）
// pass="fill"  → 塗りのみ
// pass="stroke"→ 輪郭線のみ
function CompSide({ comp, ox,oy, sc, totalH, pass="fill" }) {
  const { shape="rect", width:W=0, height:H=0, depth:D=0,
    position:pos={}, grain_direction, arc_radius, arc_start_deg, arc_end_deg, is_hidden } = comp;
  const px = (pos.z||0)*sc + ox;
  const py = oy + (totalH - (pos.y||0) - H)*sc;
  const w = D*sc, h = H*sc;

  if (is_hidden) return null;

  const fill   = pass==="fill"   ? "#d8d0c0" : "none";
  const stroke = pass==="stroke" ? "#333"    : "none";
  const sw = pass==="stroke" ? 0.8 : 0;

  if (shape==="cylinder") {
    return <g>
      <ellipse cx={px+w/2} cy={py+h} rx={w/2} ry={w*0.15} fill={fill} stroke={stroke} strokeWidth={sw}/>
      <rect x={px} y={py} width={Math.max(w,1)} height={Math.max(h,1)} fill={fill} stroke={stroke} strokeWidth={sw}/>
    </g>;
  }
  if (shape==="arc_panel" && arc_radius) {
    return <g>
      <rect x={px} y={py} width={Math.max(w,1)} height={Math.max(h,1)} fill={fill} stroke={stroke} strokeWidth={sw} strokeDasharray="4,2"/>
    </g>;
  }
  return <g>
    <rect x={px} y={py} width={Math.max(w,1)} height={Math.max(h,1)} fill={fill} stroke={stroke} strokeWidth={sw}/>
    {pass==="fill" && grain_direction && <Grain x={px} y={py} w={w} h={h} dir={grain_direction==="縦目"?"v":"h"}/>}
  </g>;
}

// 1部品のSVG描画（平面図）
// pass="fill"  → 塗りのみ
// pass="stroke"→ 輪郭線のみ
function CompTop({ comp, ox,oy, sc, totalD, pass="fill" }) {
  const { shape="rect", width:W=0, height:H=0, depth:D=0,
    position:pos={}, grain_direction, arc_radius, arc_start_deg, arc_end_deg, is_hidden } = comp;
  const px = (pos.x||0)*sc + ox;
  const py = (pos.z||0)*sc + oy;
  const w = W*sc, d = D*sc;

  if (is_hidden) return null;

  // 扉は平面図に表示しない（JIS製図：扉は正面図のみ）
  const partName = comp.part_name || "";
  if (partName.includes("扉") || partName.includes("ドア")) return null;

  // 棚板は平面図では常に奥行きの中央に一点鎖線1本（位置データに依存しない）
  const isShelf = partName.includes("棚");
  if (isShelf) {
    if (pass === "fill") return null;
    // コンポーネントの位置ではなく外枠中央(OD/2)を使用 → 常に安定した位置
    const cy = oy + (totalD / 2) * sc;
    return <line x1={ox} y1={cy} x2={ox + (+(comp.width||0)) * sc} y2={cy}
      stroke="#555" strokeWidth={0.9} strokeDasharray="8,3,2,3"/>;
  }

  const fill   = pass==="fill"   ? "#e8e0d0" : "none";
  const stroke = pass==="stroke" ? "#333"    : "none";
  const sw = pass==="stroke" ? 0.8 : 0;

  if (shape==="cylinder") {
    const r=(W/2)*sc;
    return <ellipse cx={px+r} cy={py+r} rx={r} ry={r} fill={fill} stroke={stroke} strokeWidth={sw}/>;
  }
  if (shape==="arc_panel" && arc_radius) {
    const R=arc_radius*sc, sa=arc_start_deg||180, ea=arc_end_deg||360;
    const cxA=px+w/2, cyA=py+d;
    return <g>
      <path d={arcPath(cxA,cyA,R,sa,ea)+" L "+cxA+" "+cyA+" Z"} fill={fill} stroke={stroke} strokeWidth={sw}/>
    </g>;
  }
  return <g>
    <rect x={px} y={py} width={Math.max(w,1)} height={Math.max(d,1)} fill={fill} stroke={stroke} strokeWidth={sw}/>
    {pass==="fill" && grain_direction && <Grain x={px} y={py} w={w} h={d} dir={grain_direction==="縦目"?"v":"h"}/>}
  </g>;
}

// ══════════════════════════════════════════════════
// 2D JIS図面シート（コンポーネント駆動）
// ══════════════════════════════════════════════════
function Drawing2D({ data, svgRef, onDimChange, onCompDimChange }) {
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

  // 範囲外の部品を除外（謎の白い部分の防止）
  const validComps = comps.filter(c => {
    const x = c.position?.x || 0;
    const y = c.position?.y || 0;
    const z = c.position?.z || 0;
    const w = c.width || 0;
    const h = c.height || 0;
    const d = c.depth || 0;
    return x >= -10 && y >= -10 && z >= -10 &&
           x + w <= OW + 50 &&
           y + h <= OH + 50 &&
           z + d <= OD + 50;
  });

  // ── quantityを展開（扉・引き出し等の複数枚対応）──
  // quantity:2の扉 → 同じ高さで縦積み2コンポーネントに分割
  const expandedComps = [];
  validComps.forEach(c => {
    const qty = Math.max(1, Math.round(+(c.quantity||1)));
    const isDoorOrDrawer = (c.part_name||"").includes("扉") || (c.part_name||"").includes("引き出し");
    if (qty <= 1 || !isDoorOrDrawer) {
      expandedComps.push(c);
      return;
    }
    const singleH = Math.floor((c.height||0) / qty);
    for (let i = 0; i < qty; i++) {
      expandedComps.push({
        ...c,
        part_name: qty > 1 ? `${c.part_name}${i+1}段` : c.part_name,
        height: singleH,
        quantity: 1,
        position: { ...(c.position||{}), y: (c.position?.y||0) + i * singleH }
      });
    }
  });

  // 部品をdepth順(背面→前面)にソート（正面図・平面図用）
  const sortedComps = [...expandedComps].sort((a,b)=>((a.position?.z||0)-(b.position?.z||0)));
  // 側面図用：x昇順(奥→手前)、x同値のときdepth昇順
  const sideSortedComps = [...expandedComps].sort((a,b)=>{
    const ax = a.position?.x||0, bx = b.position?.x||0;
    if (ax !== bx) return ax - bx;
    return (a.depth||0) - (b.depth||0);
  });

  // ── 縮尺の自動計算（JIS標準縮尺に丸める）──
  const physMmPerPx = 420 / SVG_W; // A3横の場合
  const rawN = 1 / (scF * physMmPerPx);
  const stdScales = [1,2,5,10,20,25,50,100,200];
  const scaleN = stdScales.reduce((p,c)=>Math.abs(c-rawN)<Math.abs(p-rawN)?c:p);
  const scaleLabel = `1:${scaleN}`;

  // 中心線パターン（長点線）
  const CL = "12,3,2,3";

  return (
    <svg ref={svgRef} width={SVG_W} height={SVG_H} viewBox={`0 0 ${SVG_W} ${SVG_H}`}
      style={{background:"#fff",maxWidth:"100%",display:"block",border:"1px solid #ccc"}}
      xmlns="http://www.w3.org/2000/svg">
      <rect width={SVG_W} height={SVG_H} fill="white"/>
      <defs>
        <clipPath id="clipFront"><rect x={fOX} y={fOY} width={fW} height={fH}/></clipPath>
        <clipPath id="clipSide"><rect x={sOX} y={sOY} width={sW} height={sH}/></clipPath>
        <clipPath id="clipTop"><rect x={tOX} y={tOY} width={tW} height={tD}/></clipPath>
      </defs>
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

      {/* 投影補助線（正面→平面、正面→側面） */}
      <line x1={fOX}    y1={fOY}    x2={tOX}    y2={tOY+tD} stroke="#ccc" strokeWidth={0.35} strokeDasharray="3,2"/>
      <line x1={fOX+fW} y1={fOY}    x2={tOX+tW} y2={tOY+tD} stroke="#ccc" strokeWidth={0.35} strokeDasharray="3,2"/>
      <line x1={fOX+fW} y1={fOY}    x2={sOX}    y2={sOY}    stroke="#ccc" strokeWidth={0.35} strokeDasharray="3,2"/>
      <line x1={fOX+fW} y1={fOY+fH} x2={sOX}    y2={sOY+sH} stroke="#ccc" strokeWidth={0.35} strokeDasharray="3,2"/>

      {/* ── 正面図 ──
          ・OW（幅）：正面図上のみ
          ・OH（高さ）：正面図右のみ
      */}
      {/* ── 正面図：1パス=塗り、2パス=線（線が常に最前面） ── */}
      <g clipPath="url(#clipFront)">
        {sortedComps.map((c,i)=><CompFront key={`ff${i}`} comp={c} ox={fOX} oy={fOY} sc={scF} totalH={OH} pass="fill"/>)}
        {sortedComps.map((c,i)=><CompFront key={`fs${i}`} comp={c} ox={fOX} oy={fOY} sc={scF} totalH={OH} pass="stroke"/>)}
      </g>
      <OutlineRect x={fOX} y={fOY} w={fW} h={fH}/>
      {/* 中心線：縦（左右対称）のみ。横中心線は上下非対称なので引かない */}
      {(()=>{
        const allX = comps.map(c=>((c.position?.x||0)+(c.width||0)/2));
        const avgX = allX.reduce((s,v)=>s+v,0)/allX.length;
        const isSymX = Math.abs(avgX - OW/2) < OW*0.1;
        const allZ = comps.map(c=>((c.position?.z||0)+(c.depth||0)/2));
        const avgZ = allZ.reduce((s,v)=>s+v,0)/allZ.length;
        const isSymZ = Math.abs(avgZ - OD/2) < OD*0.1;
        return <>
          {isSymX && <line x1={fOX+fW/2} y1={fOY-8} x2={fOX+fW/2} y2={fOY+fH+8} stroke="#888" strokeWidth={0.5} strokeDasharray={CL}/>}
          {isSymX && <line x1={tOX+tW/2} y1={tOY-8} x2={tOX+tW/2} y2={tOY+tD+8} stroke="#888" strokeWidth={0.5} strokeDasharray={CL}/>}
          {isSymZ && <line x1={sOX+sW/2} y1={sOY-8} x2={sOX+sW/2} y2={sOY+sH+8} stroke="#888" strokeWidth={0.5} strokeDasharray={CL}/>}
        </>;
      })()}
      {/* OW：正面図上のみ（平面図には出さない） */}
      <Dim ax={fOX} ay={fOY} bx={fOX+fW} by={fOY} val={OW} gap={-38} onEdit={v=>onDimChange&&onDimChange("width",v)}/>
      {/* OH：正面図右のみ（側面図には出さない） */}
      <Dim ax={fOX+fW} ay={fOY} bx={fOX+fW} by={fOY+fH} val={OH} gap={44} orient="v" onEdit={v=>onDimChange&&onDimChange("height",v)}/>

      {/* ── 平面図：1パス=塗り、2パス=線 ── */}
      <g clipPath="url(#clipTop)">
        {sortedComps.map((c,i)=><CompTop key={`tf${i}`} comp={c} ox={tOX} oy={tOY} sc={scT} totalD={OD} pass="fill"/>)}
        {sortedComps.map((c,i)=><CompTop key={`ts${i}`} comp={c} ox={tOX} oy={tOY} sc={scT} totalD={OD} pass="stroke"/>)}
      </g>
      <OutlineRect x={tOX} y={tOY} w={tW} h={tD}/>

      <Dim ax={tOX+tW} ay={tOY} bx={tOX+tW} by={tOY+tD} val={OD} gap={36} orient="v" onEdit={v=>onDimChange&&onDimChange("depth",v)}/>

      {/* ── 右側面図：1パス=塗り、2パス=線 ── */}
      <g clipPath="url(#clipSide)">
        {sideSortedComps.map((c,i)=><CompSide key={`sf${i}`} comp={c} ox={sOX} oy={sOY} sc={scS} totalH={OH} pass="fill"/>)}
        {sideSortedComps.map((c,i)=><CompSide key={`ss${i}`} comp={c} ox={sOX} oy={sOY} sc={scS} totalH={OH} pass="stroke"/>)}
      </g>
      <OutlineRect x={sOX} y={sOY} w={sW} h={sH}/>
      <Dim ax={sOX} ay={sOY} bx={sOX+sW} by={sOY} val={OD} gap={-32} onEdit={v=>onDimChange&&onDimChange("depth",v)}/>

      {/* ── 細部寸法（天板厚・脚・幕板）── 全てクリック編集可 */}
      {(()=>{
        const notes = [];
        // 幕板の高さは「長手前」か最初の幕板だけに代表表示（重複防止）
        let apronHeightDone = false;
        // 幕板の板厚も最初の1本ずつ（前後・左右で形状が異なる場合があるため）
        let apronThickFrontDone = false;
        let apronThickSideDone  = false;
        // 幕板の長さ（正面・側面それぞれ代表1本）
        let apronLengthFrontDone = false;
        let apronLengthSideDone  = false;

        comps.forEach((comp, i) => {
          const name = comp.part_name || "";
          const W = +(comp.width||0), H = +(comp.height||0), D = +(comp.depth||0);
          const pos = comp.position || {};
          const cd = (field, val) => onCompDimChange && onCompDimChange(i, field, val);

          // ① 天板の厚み → 側面図右側（クリック編集可）
          if (name.includes("天板") && H > 0) {
            const py = sOY + (OH - (pos.y||0) - H) * scS;
            const h  = H * scS;
            notes.push(
              <g key={`tp-t${i}`}>
                <Dim ax={sOX+sW} ay={py} bx={sOX+sW} by={py+h}
                  val={H} gap={18} orient="v" onEdit={v=>cd("height",v)}/>
                <text x={sOX+sW+44} y={py-4} fontSize={7} fill="#888" fontFamily={MONO}>t</text>
              </g>
            );
          }

          // ② 脚：最初の1本に代表寸法（全脚に一括反映）
          const isFirstLeg = name.includes("脚") && !comps.slice(0,i).some(c=>(c.part_name||"").includes("脚"));
          if (isFirstLeg && W > 0 && D > 0) {
            const px  = (pos.x||0)*scF + fOX;
            const py  = fOY + (OH - (pos.y||0) - H)*scF;
            const w   = W*scF, h = H*scF;
            const allLegs = (v, field) => {
              if (!onCompDimChange) return;
              comps.forEach((c2,i2)=>{ if ((c2.part_name||"").includes("脚")) onCompDimChange(i2,field,v); });
            };
            notes.push(<Dim key={`lg-h${i}`} ax={px} ay={py} bx={px} by={py+h} val={H} gap={-26} orient="v" onEdit={v=>allLegs(v,"height")}/>);
            notes.push(<Dim key={`lg-w${i}`} ax={px} ay={py+h} bx={px+w} by={py+h} val={W} gap={22} onEdit={v=>allLegs(v,"width")}/>);
            const px2 = (pos.z||0)*scS + sOX;
            const py2 = sOY + (OH - (pos.y||0) - H)*scS;
            notes.push(<Dim key={`lg-d${i}`} ax={px2} ay={py2+H*scS} bx={px2+D*scS} by={py2+H*scS} val={D} gap={22} onEdit={v=>allLegs(v,"depth")}/>);
          }

          // ③ 幕板の高さ → 正面図・代表1本のみ
          if (name.includes("幕板") && H > 0 && !apronHeightDone) {
            const px = (pos.x||0)*scF + fOX;
            const py = fOY + (OH - (pos.y||0) - H)*scF;
            notes.push(
              <Dim key={`ap-h${i}`} ax={px} ay={py} bx={px} by={py+H*scF}
                val={H} gap={-28} orient="v" onEdit={v=>cd("height",v)}/>
            );
            apronHeightDone = true;
          }

          // ④ 幕板の板厚（短手＜80mm）・正面図側は1回、側面図側は1回だけ
          if (name.includes("幕板") && W > 0 && D > 0 && W <= D && W < 80 && !apronThickFrontDone) {
            const px = (pos.x||0)*scF + fOX;
            const py = fOY + (OH - (pos.y||0) - H)*scF;
            notes.push(<Dim key={`ap-w${i}`} ax={px} ay={py} bx={px+W*scF} by={py} val={W} gap={-18} onEdit={v=>cd("width",v)}/>);
            apronThickFrontDone = true;
          }
          if (name.includes("幕板") && W > 0 && D > 0 && D < W && D < 80 && !apronThickSideDone) {
            const px2 = (pos.z||0)*scS + sOX;
            const py2 = sOY + (OH - (pos.y||0) - H)*scS;
            notes.push(<Dim key={`ap-d${i}`} ax={px2} ay={py2} bx={px2+D*scS} by={py2} val={D} gap={-18} onEdit={v=>cd("depth",v)}/>);
            apronThickSideDone = true;
          }

          // ⑤ 長手幕板の長さ（W が主寸法）→ 正面図に横寸法・代表1本
          //    W > D かつ W >= 80mm → 長手幕板と判断
          if (name.includes("幕板") && W >= D && W >= 80 && !apronLengthFrontDone) {
            const px = (pos.x||0)*scF + fOX;
            const py = fOY + (OH - (pos.y||0) - H)*scF;
            notes.push(
              <Dim key={`ap-lf${i}`} ax={px} ay={py+H*scF} bx={px+W*scF} by={py+H*scF}
                val={W} gap={20} onEdit={v=>cd("width",v)}/>
            );
            apronLengthFrontDone = true;
          }

          // ⑥ 短手幕板の長さ（D が主寸法）→ 側面図に横寸法・代表1本
          //    D > W かつ D >= 80mm → 短手幕板と判断
          if (name.includes("幕板") && D > W && D >= 80 && !apronLengthSideDone) {
            const px2 = (pos.z||0)*scS + sOX;
            const py2 = sOY + (OH - (pos.y||0) - H)*scS;
            notes.push(
              <Dim key={`ap-ls${i}`} ax={px2} ay={py2+H*scS} bx={px2+D*scS} by={py2+H*scS}
                val={D} gap={20} onEdit={v=>cd("depth",v)}/>
            );
            apronLengthSideDone = true;
          }
        });
        return <g>{notes}</g>;
      })()}

      {/* 部品バルーン（全部品対応・リーダー線は外形線上から引き出す・BOM表と番号一致） */}
      {comps.map((c,i)=>{
        const cx = fOX + ((c.position?.x||0) + (c.width||0)/2)*scF;
        const cy = fOY + (OH - (c.position?.y||0) - (c.height||0)/2)*scF;
        // 図面外に出る部品はバルーン省略
        if (cx < fOX || cx > fOX+fW || cy < fOY || cy > fOY+fH) return null;
        // リーダー線の起点：部品の右上コーナー（外形線上）
        const ex = fOX + ((c.position?.x||0) + (c.width||0))*scF;
        const ey = fOY + (OH - (c.position?.y||0) - (c.height||0))*scF;
        const lx = ex + 18, ly = ey - 14;
        return <g key={i}>
          <line x1={ex} y1={ey} x2={lx} y2={ly} stroke={C.dim} strokeWidth={0.5} strokeDasharray="3,2"/>
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
        [SVG_W*0.52+8,SVG_H-TBH+12,7,"#aaa","縮尺 / SCALE"],
        [SVG_W*0.52+8,SVG_H-TBH+28,10,"#333",scaleLabel],
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
  const sv = Math.min(220/OW, 220/OH, 220/OD);
  const C30=Math.cos(Math.PI/6), S30=Math.sin(Math.PI/6);
  const SW=620, SH=580;
  const cx=SW*0.36, cy=SH*0.60;

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
    // 部品タイプで色を決定（脚は全部同じ色、天板は別色）
    const name = comp.part_name || "";
    const isLegComp = name.includes("脚");
    const isTopComp = name.includes("天板");
    const colorIdx = isLegComp ? 3 : isTopComp ? 0 : (name.includes("幕板") ? 1 : idx % woodColors.length);
    const cols = woodColors[colorIdx];
    // 脚は最小表示サイズ16pxを確保
    const minLegPx = 16;
    const w = isLegComp ? Math.max(W*sv, minLegPx) : W*sv;
    const d = isLegComp ? Math.max(D*sv, minLegPx) : D*sv;
    const h = H*sv;

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
    // Z方向が主軸のパネル（短手幕板など）は右面をスキップ→「ついたて」防止
    const isZPanel = D > W * 2;
    return <g key={idx}>
      {/* 上面 */}
      {face([[x,y+h,z],[x+w,y+h,z],[x+w,y+h,z+d],[x,y+h,z+d]],cols[0])}
      {/* 正面 */}
      {face([[x,y,z],[x+w,y,z],[x+w,y+h,z],[x,y+h,z]],cols[1])}
      {/* 右面：Z方向主体パネルはスキップ */}
      {!isZPanel && face([[x+w,y,z],[x+w,y,z+d],[x+w,y+h,z+d],[x+w,y+h,z]],cols[2])}
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
      {[...comps].sort((a,b)=>{
        // 天板は最後に描画（一番上に表示）
        const aIsTop = (a.part_name||"").includes("天板");
        const bIsTop = (b.part_name||"").includes("天板");
        if (aIsTop && !bIsTop) return 1;
        if (!aIsTop && bIsTop) return -1;
        return (b.position?.z||0)-(a.position?.z||0);
      }).map((c,i)=>renderComp(c,i))}
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
    const sc = Math.min(CW,CH) / Math.max(OW,OH,OD) * 0.42;
    const { yaw, pitch } = stateRef.current;

    // 投影
    const proj = (x,y,z) => {
      const cx2=x-OW*sc/2, cy2=y-OH*sc/2, cz2=z-OD*sc/2;
      const rx =  cx2*Math.cos(yaw) + cz2*Math.sin(yaw);
      const rz1= -cx2*Math.sin(yaw) + cz2*Math.cos(yaw);
      const ry =  cy2*Math.cos(pitch) - rz1*Math.sin(pitch);
      const rz =  cy2*Math.sin(pitch) + rz1*Math.cos(pitch);
      const fov=2400, zz=rz+fov;
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
// 部品図（正面図＋側面図のペアで表示）
// ══════════════════════════════════════════════════
function PartDrawings({ data }) {
  if (!data?.components?.length) return <div style={{padding:40,textAlign:"center",color:C.sub}}>部品情報がありません</div>;

  const comps = data.components.filter(c => !c.is_hidden && (c.width||0) > 0 && (c.height||0) > 0);

  // 1ビューのSVGを描画するヘルパー（scを外から受け取り比率統一）
  const DrawView = ({ W, H, label, fill, isDoor, isDrawer, grain, id, sc: scOverride }) => {
    const PAD = 14, DIM_H = 20, DIM_V = 22;
    const MIN_PX = 4;
    const pw = Math.max((scOverride || 1) * W, MIN_PX);
    const ph = Math.max((scOverride || 1) * H, MIN_PX);
    const SVG_W = pw + PAD*2 + DIM_V;
    const SVG_H = ph + PAD*2 + DIM_H;
    const ox = PAD;
    const oy = PAD + DIM_H;
    const markId = `arr-${id}`;

    return (
      <div style={{minWidth:0}}>
        <div style={{fontSize:8,color:C.sub,marginBottom:2}}>{label}</div>
        <svg width={SVG_W} height={SVG_H} style={{display:"block"}}>
          <defs>
            <marker id={markId} viewBox="0 0 6 6" refX="3" refY="3" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
              <path d="M1 1L5 3L1 5" fill="none" stroke={C.dim} strokeWidth="1"/>
            </marker>
          </defs>
          {/* 本体 */}
          <rect x={ox} y={oy} width={Math.max(pw,1)} height={Math.max(ph,1)} fill={fill} stroke="#555" strokeWidth={0.8}/>
          {/* 木目 */}
          {grain && (() => {
            const dir = grain === "縦目" ? "v" : "h";
            return Array.from({length:3},(_,i) => dir==="h"
              ? <line key={i} x1={ox+2} y1={oy+ph/4*(i+1)} x2={ox+pw-2} y2={oy+ph/4*(i+1)} stroke="#b5882a" strokeWidth={0.4} strokeDasharray="3,2" opacity={0.5}/>
              : <line key={i} x1={ox+pw/4*(i+1)} y1={oy+2} x2={ox+pw/4*(i+1)} y2={oy+ph-2} stroke="#b5882a" strokeWidth={0.4} strokeDasharray="3,2" opacity={0.5}/>
            );
          })()}
          {/* 扉の対角線 */}
          {isDoor && <>
            <line x1={ox} y1={oy} x2={ox+pw} y2={oy+ph} stroke="#888" strokeWidth={0.6}/>
            <line x1={ox+pw} y1={oy} x2={ox} y2={oy+ph} stroke="#888" strokeWidth={0.6}/>
          </>}
          {/* 引き出しの横線 */}
          {isDrawer && [0.3,0.5,0.7].map((r,i)=>
            <line key={i} x1={ox+4} y1={oy+ph*r} x2={ox+pw-4} y2={oy+ph*r} stroke="#888" strokeWidth={0.5}/>
          )}
          {/* 幅寸法（上） */}
          <line x1={ox} y1={oy-3} x2={ox} y2={oy-9} stroke={C.dim} strokeWidth={0.5}/>
          <line x1={ox+pw} y1={oy-3} x2={ox+pw} y2={oy-9} stroke={C.dim} strokeWidth={0.5}/>
          <line x1={ox} y1={oy-7} x2={ox+pw} y2={oy-7} stroke={C.dim} strokeWidth={0.5} markerStart={`url(#${markId})`} markerEnd={`url(#${markId})`}/>
          <text x={ox+pw/2} y={oy-10} textAnchor="middle" fill={C.dim} fontSize={7.5} fontFamily={MONO} fontWeight="600">{Math.round(W)}</text>
          {/* 高さ寸法（右） */}
          <line x1={ox+pw+3} y1={oy} x2={ox+pw+9} y2={oy} stroke={C.dim} strokeWidth={0.5}/>
          <line x1={ox+pw+3} y1={oy+ph} x2={ox+pw+9} y2={oy+ph} stroke={C.dim} strokeWidth={0.5}/>
          <line x1={ox+pw+7} y1={oy} x2={ox+pw+7} y2={oy+ph} stroke={C.dim} strokeWidth={0.5}/>
          <text x={ox+pw+10} y={oy+ph/2+3} fill={C.dim} fontSize={7.5} fontFamily={MONO} fontWeight="600">{Math.round(H)}</text>
        </svg>
      </div>
    );
  };

  return (
    <div style={{display:"flex",flexWrap:"wrap",gap:12,padding:4}}>
      {comps.map((comp, idx) => {
        const W = +(comp.width||0), H = +(comp.height||0), D = +(comp.depth||0);
        const isDoor   = (comp.part_name||"").includes("扉");
        const isDrawer = (comp.part_name||"").includes("引き出し");
        const fill = isDrawer ? "#cdd4c0" : "#e0d8c8";
        const grain = comp.grain_direction;

        // 3辺を大きい順に並べて、上位2辺が主面・最小が厚み
        const dims = [
          {label:"W", val:W},
          {label:"H", val:H},
          {label:"D", val:D},
        ].sort((a,b) => b.val - a.val);
        const mainA = dims[0]; // 主面の長辺
        const mainB = dims[1]; // 主面の短辺
        const thick  = dims[2]; // 厚み

        // 共通スケール：主面がカード内に収まる最大サイズを基準に計算
        // 主面エリア：幅約220px・高さ約160px を目安
        const MAIN_MAX_W = 220, MAIN_MAX_H = 160;
        const sc = Math.min(MAIN_MAX_W / Math.max(mainA.val, 1), MAIN_MAX_H / Math.max(mainB.val, 1)) * 0.85;

        return (
          <div key={idx} style={{
            background:C.panel, border:`1px solid ${C.border2}`,
            borderRadius:8, padding:"10px 12px 8px",
            width:"auto", flexShrink:0, display:"inline-block",
          }}>
            {/* 部品名 */}
            <div style={{fontSize:11,fontWeight:700,color:C.accent,marginBottom:8,
              whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",maxWidth:400}}>
              {String(idx+1).padStart(2,"0")}. {comp.part_name}
            </div>

            {/* メインレイアウト：左列（主面＋小口）＋ 右列（厚み縦棒） */}
            <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>

              {/* 左列：主面の下に小口を積む（同じスケール） */}
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                <DrawView W={mainA.val} H={mainB.val}
                  label={`主面 ${mainA.label}×${mainB.label}`}
                  fill={fill} isDoor={isDoor} isDrawer={isDrawer} grain={grain}
                  id={`f${idx}`} sc={sc}/>
                <DrawView W={mainA.val} H={thick.val}
                  label={`小口 ${thick.label}=${Math.round(thick.val)}mm`}
                  fill={fill} isDoor={false} isDrawer={false} grain={grain}
                  id={`e${idx}`} sc={sc}/>
              </div>

              {/* 区切り */}
              <div style={{width:1,background:C.border,alignSelf:"stretch"}}/>

              {/* 右列：厚み縦棒（同じスケール） */}
              <DrawView W={thick.val} H={mainB.val}
                label={`厚み ${thick.label}=${Math.round(thick.val)}mm`}
                fill={fill} isDoor={false} isDrawer={false} grain={null}
                id={`t${idx}`} sc={sc}/>
            </div>

            {/* 寸法テキスト */}
            <div style={{fontSize:9,color:C.sub,fontFamily:MONO,marginTop:6,textAlign:"center"}}>
              W{Math.round(W)} × H{Math.round(H)}{D > 0 ? ` × D${Math.round(D)}` : ""} mm
            </div>
          </div>
        );
      })}
    </div>
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
// Material Engine v2 ── Cut List + 材料費・工賃・見積
// ══════════════════════════════════════════════════
function MaterialEngine({ data }) {
  const BOARD_W = 1820, BOARD_H = 910;
  const YIELD = 0.7;

  const MATERIAL_PRESETS = [
    { label:"ポリ合板 18mm",   price:5000,  thickness:18 },
    { label:"シナ合板 18mm",   price:7000,  thickness:18 },
    { label:"メラミン 18mm",   price:9000,  thickness:18 },
    { label:"化粧板 18mm",     price:8000,  thickness:18 },
    { label:"無垢材（杉）",    price:15000, thickness:30 },
    { label:"無垢材（オーク）",price:35000, thickness:30 },
  ];

  const [matIdx,      setMatIdx]      = useState(0);
  const [boardPrice,  setBoardPrice]  = useState(MATERIAL_PRESETS[0].price);
  const [useTimeMode, setUseTimeMode] = useState(false);
  const [manualTotal, setManualTotal] = useState(null); // null=自動計算, 数値=手動入力
  const [laborHours,  setLaborHours]  = useState(4);
  const [hourlyRate,  setHourlyRate]  = useState(4000);
  // 会社情報（B設計：複数職人対応）
  const [companyName, setCompanyName] = useState("赤 装 木 工 所");
  const [contactName, setContactName] = useState("");
  const [clientName,  setClientName]  = useState("");

  if (!data?.components?.length) return <div style={{padding:40,textAlign:"center",color:C.sub}}>図面データがありません</div>;

  const t = MATERIAL_PRESETS[matIdx].thickness;

  // ── カットリスト生成 ──
  // 各部品の「カット寸法」を求める
  // 正面向き板（天板・底板・背板・扉）→ W×D or W×H
  // 側面向き板（左右側板）→ D×H
  const cutList = data.components.map(c => {
    const W = +c.width||0, H = +c.height||0, D = +c.depth||0;
    const name = c.part_name || "";
    const qty = +c.quantity||1;

    let cutW, cutH;
    // 側板：幅が薄い（板厚相当）→ 奥行き×高さ
    if (W <= t*2 && D > 0 && H > 0) {
      cutW = D; cutH = H;
    }
    // 背板：奥行きが薄い → 幅×高さ
    else if (D <= t*2 && W > 0 && H > 0) {
      cutW = W; cutH = H;
    }
    // 天板・底板・棚板：高さが薄い → 幅×奥行き
    else if (H <= t*2 && W > 0 && D > 0) {
      cutW = W; cutH = D;
    }
    // 扉・その他：幅×高さ（前面パネル）
    else {
      cutW = W > D ? W : D;
      cutH = H;
    }
    const area = (cutW * cutH) / 1e6;
    return { name, cutW, cutH, area, qty };
  });

  const boardArea   = BOARD_W * BOARD_H / 1e6;
  const totalArea   = cutList.reduce((s,p) => s + p.area * p.qty, 0);
  const adjustedArea= totalArea / YIELD;
  const boardsNeeded= Math.ceil(adjustedArea / boardArea);
  const materialCost= boardsNeeded * boardPrice;

  // 赤木式 3:3:3 または 時間入力モード
  const laborCost = useTimeMode ? laborHours * hourlyRate : materialCost;
  const profit    = materialCost;
  const total     = materialCost + laborCost + profit;

  // ── 見積PDF出力 ──
  const finalTotal = manualTotal !== null ? manualTotal : total;

  const exportQuotePDF = () => {
    const today = new Date().toLocaleDateString("ja-JP");
    const od = data.overall_dimensions || {};
    const win = window.open("", "_blank");
    win.document.write(`<!DOCTYPE html><html><head>
<meta charset="UTF-8">
<title>見積書</title>
<style>
  @page { size: A4; margin: 20mm; }
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: 'Hiragino Kaku Gothic ProN','Noto Sans JP',sans-serif; font-size:11px; color:#111; }
  h1 { font-size:22px; font-weight:900; letter-spacing:8px; text-align:center; margin-bottom:4px; }
  .sub { text-align:center; font-size:10px; color:#666; margin-bottom:24px; }
  .meta { display:flex; justify-content:space-between; margin-bottom:20px; }
  .meta-left { font-size:11px; line-height:1.8; }
  .meta-right { font-size:10px; color:#444; text-align:right; line-height:1.8; }
  .product { background:#f5f5f5; border-radius:4px; padding:10px 14px; margin-bottom:16px; }
  .product h2 { font-size:14px; font-weight:700; margin-bottom:4px; }
  .product p { font-size:10px; color:#555; }
  table { width:100%; border-collapse:collapse; margin-bottom:16px; }
  thead th { background:#222; color:#fff; padding:7px 10px; font-size:10px; text-align:left; }
  tbody td { padding:6px 10px; border-bottom:1px solid #e0e0e0; font-size:10px; }
  tbody tr:nth-child(even) { background:#fafafa; }
  .total-section { border:2px solid #1f6feb; border-radius:6px; padding:14px 18px; }
  .total-row { display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px solid #e8e8e8; }
  .total-row.final { padding:12px 0; border-bottom:none; border-top:2px solid #1f6feb; margin-top:4px; }
  .total-label { font-size:12px; color:#555; }
  .total-value { font-size:13px; font-weight:700; font-family:monospace; }
  .total-value.big { font-size:22px; color:#1f6feb; }
  .footer { margin-top:20px; font-size:9px; color:#999; text-align:center; }
  .note { margin-top:16px; font-size:10px; color:#555; line-height:1.8; }
  @media print { body { -webkit-print-color-adjust:exact; print-color-adjust:exact; } }
</style>
</head><body>
<h1>見　積　書</h1>
<p class="sub">TESHIGOTO — Craft Intelligence Platform</p>
<div class="meta">
  <div class="meta-left">
    <div>${clientName ? `お客様：${clientName} 様` : ""}</div>
  </div>
  <div class="meta-right">
    <div><strong>${companyName}</strong></div>
    ${contactName ? `<div>担当：${contactName}</div>` : ""}
    <div>作成日：${today}</div>
  </div>
</div>
<div class="product">
  <h2>${data.furniture_name || "家具"}</h2>
  <p>W${od.width || "-"} × H${od.height || "-"} × D${od.depth || "-"} mm　|　材料：${MATERIAL_PRESETS[matIdx].label}</p>
</div>
<table>
  <thead><tr>
    <th>部品名</th><th>カット寸法</th><th>枚数</th>
  </tr></thead>
  <tbody>
    ${cutList.map(p=>`<tr>
      <td>${p.name}</td>
      <td style="font-family:monospace">${p.cutW} × ${p.cutH} mm</td>
      <td>${p.qty}</td>
    </tr>`).join("")}
  </tbody>
</table>
<div class="total-section">
  <div class="total-row"><span class="total-label">材料費（3×6板 ${boardsNeeded}枚）</span><span class="total-value">¥${materialCost.toLocaleString()}</span></div>
  <div class="total-row"><span class="total-label">工賃</span><span class="total-value">¥${laborCost.toLocaleString()}</span></div>
  <div class="total-row"><span class="total-label">利益</span><span class="total-value">¥${profit.toLocaleString()}</span></div>
  <div class="total-row final"><span class="total-label" style="font-size:15px;font-weight:800">お見積り合計</span><span class="total-value big">¥${total.toLocaleString()}</span></div>
</div>
<div class="note">
  ※ 本見積書の有効期限は発行日より30日間です。<br>
  ※ 材料費は市場価格により変動する場合があります。
</div>
<div class="footer">Powered by TESHIGOTO — Craft Intelligence Platform</div>
<script>window.onload=()=>window.print();</script>
</body></html>`);
    const iframe = document.createElement("iframe");
    iframe.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;border:none;z-index:9999;background:#fff";
    iframe.srcdoc = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>見積書</title><style>
  @page { size: A4; margin: 20mm; }
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: 'Hiragino Kaku Gothic ProN','Noto Sans JP',sans-serif; font-size:11px; color:#111; }
  h1 { font-size:22px; font-weight:900; letter-spacing:8px; text-align:center; margin-bottom:4px; }
  .sub { text-align:center; font-size:10px; color:#666; margin-bottom:24px; }
  .meta { display:flex; justify-content:space-between; margin-bottom:20px; }
  .meta-left { font-size:11px; line-height:1.8; }
  .meta-right { font-size:10px; color:#444; text-align:right; line-height:1.8; }
  .product { background:#f5f5f5; border-radius:4px; padding:10px 14px; margin-bottom:16px; }
  .product h2 { font-size:14px; font-weight:700; margin-bottom:4px; }
  .product p { font-size:10px; color:#555; }
  table { width:100%; border-collapse:collapse; margin-bottom:16px; }
  thead th { background:#222; color:#fff; padding:7px 10px; font-size:10px; text-align:left; }
  tbody td { padding:6px 10px; border-bottom:1px solid #e0e0e0; font-size:10px; }
  tbody tr:nth-child(even) { background:#fafafa; }
  .total-section { border:2px solid #1f6feb; border-radius:6px; padding:14px 18px; }
  .total-row { display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px solid #e8e8e8; }
  .total-row.final { padding:12px 0; border-bottom:none; border-top:2px solid #1f6feb; margin-top:4px; }
  .total-label { font-size:12px; color:#555; }
  .total-value { font-size:13px; font-weight:700; font-family:monospace; }
  .total-value.big { font-size:22px; color:#1f6feb; }
  .footer { margin-top:20px; font-size:9px; color:#999; text-align:center; }
  .note { margin-top:16px; font-size:10px; color:#555; line-height:1.8; }
  .close-btn { position:fixed; top:12px; right:16px; padding:8px 18px; background:#d73a49; color:#fff; border:none; border-radius:6px; font-size:13px; font-weight:700; cursor:pointer; }
  @media print { .close-btn { display:none; } body { -webkit-print-color-adjust:exact; print-color-adjust:exact; } }
</style></head><body>
<button class="close-btn" onclick="document.body.parentElement.parentElement.parentElement.removeChild(document.body.parentElement.parentElement)">✕ 閉じる</button>
<button class="close-btn" style="right:100px;background:#1f6feb" onclick="window.print()">🖨️ 印刷</button>
<h1>見　積　書</h1>
<p class="sub">TESHIGOTO — Craft Intelligence Platform</p>
<div class="meta">
  <div class="meta-left"><div>${clientName ? `お客様：${clientName} 様` : ""}</div></div>
  <div class="meta-right">
    <div><strong>${companyName}</strong></div>
    ${contactName ? `<div>担当：${contactName}</div>` : ""}
    <div>作成日：${new Date().toLocaleDateString("ja-JP")}</div>
  </div>
</div>
<div class="product">
  <h2>${data.furniture_name || "家具"}</h2>
  <p>W${(data.overall_dimensions||{}).width||"-"} × H${(data.overall_dimensions||{}).height||"-"} × D${(data.overall_dimensions||{}).depth||"-"} mm　|　材料：${MATERIAL_PRESETS[matIdx].label}</p>
</div>
<table>
  <thead><tr><th>部品名</th><th>カット寸法</th><th>枚数</th></tr></thead>
  <tbody>${cutList.map(p=>`<tr><td>${p.name}</td><td style="font-family:monospace">${p.cutW} × ${p.cutH} mm</td><td>${p.qty}</td></tr>`).join("")}</tbody>
</table>
<div class="total-section">
  <div class="total-row"><span class="total-label">材料費（3×6板 ${boardsNeeded}枚）</span><span class="total-value">¥${materialCost.toLocaleString()}</span></div>
  <div class="total-row"><span class="total-label">工賃</span><span class="total-value">¥${laborCost.toLocaleString()}</span></div>
  <div class="total-row"><span class="total-label">利益</span><span class="total-value">¥${profit.toLocaleString()}</span></div>
  <div class="total-row final"><span class="total-label" style="font-size:15px;font-weight:800">お見積り合計</span><span class="total-value big">¥${total.toLocaleString()}</span></div>
</div>
<div class="note">※ 本見積書の有効期限は発行日より30日間です。<br>※ 材料費は市場価格により変動する場合があります。</div>
<div class="footer">Powered by TESHIGOTO — Craft Intelligence Platform</div>
</body></html>`;
    document.body.appendChild(iframe);
  };

  const row = (label, val, col=C.text) => (
    <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${C.border}`}}>
      <span style={{fontSize:12,color:C.sub}}>{label}</span>
      <span style={{fontSize:13,fontWeight:700,fontFamily:MONO,color:col}}>{val}</span>
    </div>
  );

  const inputStyle = {
    background:"#0d1117", border:`1px solid ${C.border2}`, borderRadius:5,
    color:"#79c0ff", fontSize:13, fontFamily:MONO, textAlign:"right",
    padding:"6px 10px", outline:"none", width:"100px"
  };
  const textInputStyle = {
    background:"#0d1117", border:`1px solid ${C.border2}`, borderRadius:5,
    color:C.text, fontSize:12, padding:"6px 10px", outline:"none", width:"100%", fontFamily:SANS,
  };

  return (
    <div style={{maxWidth:640}}>
      {/* 会社情報 */}
      <div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:8,padding:"16px 18px",marginBottom:14}}>
        <div style={{fontSize:13,fontWeight:800,color:C.accent,marginBottom:14}}>🏢 見積書情報</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
          {[["会社名・工房名", companyName, setCompanyName],
            ["担当者名", contactName, setContactName],
            ["お客様名", clientName, setClientName]
          ].map(([label, val, setter])=>(
            <div key={label}>
              <div style={{fontSize:10,color:C.sub,marginBottom:4}}>{label}</div>
              <input style={textInputStyle} value={val} onChange={e=>setter(e.target.value)} placeholder={label}/>
            </div>
          ))}
        </div>
      </div>
      {/* 材料設定 */}
      <div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:8,padding:"16px 18px",marginBottom:14}}>
        <div style={{fontSize:13,fontWeight:800,color:C.accent,marginBottom:14}}>🪵 材料設定</div>
        <div style={{marginBottom:12}}>
          <div style={{fontSize:10,color:C.sub,marginBottom:6}}>材料タイプ</div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {MATERIAL_PRESETS.map((m,i)=>(
              <button key={i} onClick={()=>{setMatIdx(i);setBoardPrice(m.price);}}
                style={{padding:"5px 10px",borderRadius:5,fontSize:10,fontWeight:600,cursor:"pointer",
                  background:matIdx===i?C.accent2+"44":"#21262d",
                  border:`1px solid ${matIdx===i?C.accent:C.border2}`,
                  color:matIdx===i?C.accent:C.sub}}>
                {m.label}
              </button>
            ))}
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <div>
            <div style={{fontSize:10,color:C.sub,marginBottom:4}}>3×6板 1枚の価格（円）</div>
            <input type="number" style={inputStyle} value={boardPrice} onChange={e=>setBoardPrice(+e.target.value)}/>
          </div>
          <div>
            <div style={{fontSize:10,color:C.sub,marginBottom:4}}>歩留まり（%）</div>
            <input type="number" style={{...inputStyle,color:C.sub}} value={Math.round(YIELD*100)} readOnly/>
          </div>
        </div>
      </div>

      {/* カットリスト */}
      <div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:8,padding:"16px 18px",marginBottom:14}}>
        <div style={{fontSize:13,fontWeight:800,color:C.accent,marginBottom:4}}>🔪 カットリスト</div>
        <div style={{fontSize:10,color:C.sub,marginBottom:12}}>職人がそのまま使えるカット寸法</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr auto auto",gap:"0 12px",alignItems:"center"}}>
          {/* ヘッダー */}
          <div style={{fontSize:9,color:C.sub,fontWeight:600,paddingBottom:6,borderBottom:`1px solid ${C.border2}`}}>部品名</div>
          <div style={{fontSize:9,color:C.sub,fontWeight:600,paddingBottom:6,borderBottom:`1px solid ${C.border2}`,textAlign:"right"}}>カット寸法</div>
          <div style={{fontSize:9,color:C.sub,fontWeight:600,paddingBottom:6,borderBottom:`1px solid ${C.border2}`,textAlign:"right"}}>面積</div>
          {/* 部品リスト */}
          {cutList.map((p,i)=><>
            <div key={`n${i}`} style={{fontSize:12,color:C.text,padding:"6px 0",borderBottom:`1px solid ${C.border}`}}>
              {p.name}{p.qty>1?` ×${p.qty}`:""}
            </div>
            <div key={`d${i}`} style={{fontSize:12,fontFamily:MONO,color:"#79c0ff",padding:"6px 0",borderBottom:`1px solid ${C.border}`,textAlign:"right"}}>
              {p.cutW} × {p.cutH} mm
            </div>
            <div key={`a${i}`} style={{fontSize:11,fontFamily:MONO,color:C.sub,padding:"6px 0",borderBottom:`1px solid ${C.border}`,textAlign:"right"}}>
              {(p.area*p.qty).toFixed(3)}m²
            </div>
          </>)}
        </div>
        <div style={{marginTop:12}}>
          {row("面積合計",      `${totalArea.toFixed(3)} m²`)}
          {row("歩留まり補正後",`${adjustedArea.toFixed(3)} m²`)}
          {row("3×6板 枚数",   `${boardsNeeded} 枚`)}
          {row("材料費",        `¥${materialCost.toLocaleString()}`, C.warn)}
        </div>
      </div>

      {/* 工賃 */}
      <div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:8,padding:"16px 18px",marginBottom:14}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
          <div style={{fontSize:13,fontWeight:800,color:C.accent}}>⏱️ 工賃</div>
          {/* モード切替 */}
          <div style={{display:"flex",gap:0,borderRadius:6,overflow:"hidden",border:`1px solid ${C.border2}`}}>
            {[["赤木式（自動）", false],["時間入力", true]].map(([label, mode])=>(
              <button key={label} onClick={()=>setUseTimeMode(mode)}
                style={{padding:"4px 10px",fontSize:10,fontWeight:600,cursor:"pointer",border:"none",
                  background:useTimeMode===mode?C.accent2:"#21262d",
                  color:useTimeMode===mode?"#fff":C.sub}}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {!useTimeMode ? (
          <div style={{padding:"10px 14px",background:"#0d1117",borderRadius:6,border:`1px solid ${C.border2}`}}>
            <div style={{fontSize:10,color:C.sub,marginBottom:6}}>赤木式：材料費 : 工賃 : 利益 = 3 : 3 : 3</div>
            <div style={{fontSize:12,color:C.text}}>工賃 = 材料費と同額（自動計算）</div>
          </div>
        ) : (
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <div>
              <div style={{fontSize:10,color:C.sub,marginBottom:4}}>作業時間（時間）</div>
              <input type="number" style={inputStyle} value={laborHours} onChange={e=>setLaborHours(+e.target.value)}/>
            </div>
            <div>
              <div style={{fontSize:10,color:C.sub,marginBottom:4}}>時給（円）</div>
              <input type="number" style={inputStyle} value={hourlyRate} onChange={e=>setHourlyRate(+e.target.value)}/>
            </div>
          </div>
        )}
        <div style={{marginTop:10}}>{row("工賃", `¥${laborCost.toLocaleString()}`, C.ok)}</div>
      </div>

      {/* 見積 */}
      <div style={{background:"#0d1117",border:`2px solid ${C.accent}`,borderRadius:8,padding:"16px 18px",marginBottom:14}}>
        <div style={{fontSize:13,fontWeight:800,color:C.accent,marginBottom:4}}>💴 見積</div>
        <div style={{fontSize:10,color:C.sub,marginBottom:14}}>材料費 × 3（赤木式）</div>
        {row("材料費 ×1", `¥${materialCost.toLocaleString()}`)}
        {row("工賃 ×1",   `¥${laborCost.toLocaleString()}`)}
        {row("利益 ×1",   `¥${profit.toLocaleString()}`)}
        <div style={{borderTop:`2px solid ${C.accent2}`,marginTop:4,paddingTop:12}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
            <span style={{fontSize:15,fontWeight:800,color:C.text}}>見積合計</span>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:13,color:C.sub}}>¥</span>
              <input
                type="number"
                value={manualTotal !== null ? manualTotal : total}
                onChange={e => setManualTotal(+e.target.value)}
                style={{
                  background:"#1a2030", border:`2px solid ${C.accent}`,
                  borderRadius:6, color:C.accent,
                  fontSize:22, fontFamily:MONO, fontWeight:900,
                  textAlign:"right", padding:"4px 10px",
                  outline:"none", width:160
                }}
              />
            </div>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{fontSize:10,color:C.sub}}>
              自動計算: ¥{total.toLocaleString()}
            </div>
            {manualTotal !== null && (
              <button onClick={()=>setManualTotal(null)}
                style={{fontSize:10,color:C.sub,background:"none",border:`1px solid ${C.border2}`,borderRadius:4,padding:"2px 8px",cursor:"pointer"}}>
                自動に戻す
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 見積PDF出力ボタン */}
      <button onClick={exportQuotePDF}
        style={{width:"100%",padding:"14px",background:"#d73a49",color:"#fff",border:"none",borderRadius:8,fontSize:14,fontWeight:800,cursor:"pointer",letterSpacing:1,marginBottom:14}}>
        📄 見積書PDFをダウンロード
      </button>
    </div>
  );
}


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

            {/* 形状 */}
            <div style={{ marginBottom: 8 }}>
              <label style={{ ...labelStyle, fontSize: 10 }}>形状 (shape)</label>
              <select style={{ ...inputStyle, fontSize: 11 }} value={comp.shape || "rect"}
                onChange={e => setCompField(idx, "shape", e.target.value)}>
                <option value="rect">rect（角材・板材）</option>
                <option value="cylinder">cylinder（丸脚）</option>
                <option value="arc_panel">arc_panel（曲線パネル）</option>
              </select>
            </div>

            {/* 寸法・数量 */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", gap: 8 }}>
              {[["幅 W", "width"], ["高さ H", "height"], ["奥行 D", "depth"], ["板厚", "panel_thickness"], ["数量", "quantity"]].map(([label, key]) => (
                <div key={key}>
                  <label style={{ ...labelStyle, fontSize: 10 }}>{label}</label>
                  <input type="number" style={{ ...numInputStyle, fontSize: 11 }}
                    value={comp[key] ?? ""}
                    onChange={e => setCompField(idx, key, +e.target.value)}/>
                </div>
              ))}
            </div>

            {/* 位置座標 */}
            <div style={{ marginTop: 8 }}>
              <label style={{ ...labelStyle, fontSize: 10, marginBottom: 5 }}>
                位置座標 (mm)
                <span style={{ color:"#555", fontWeight:400, fontSize:9, marginLeft:6 }}>X=右方向 / Y=上方向 / Z=奥方向</span>
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                {[["X（幅方向）", "x"], ["Y（高さ方向）", "y"], ["Z（奥行方向）", "z"]].map(([label, axis]) => (
                  <div key={axis}>
                    <label style={{ ...labelStyle, fontSize: 9 }}>{label}</label>
                    <input type="number" style={{ ...numInputStyle, fontSize: 11 }}
                      value={comp.position?.[axis] ?? 0}
                      onChange={e => {
                        const val = +e.target.value;
                        setD(prev => {
                          const next = JSON.parse(JSON.stringify(prev));
                          if (!next.components[idx].position) next.components[idx].position = {};
                          next.components[idx].position[axis] = val;
                          return next;
                        });
                      }}/>
                  </div>
                ))}
              </div>
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


// ══════════════════════════════════════════════════
// Sketch Engine v1 ── 2ステップ（安定版）
// Step1: 観察（寸法・構造・タイトルを全読み）
// Step2: JSON生成（収納BOX・扉・引き出し対応）
// ══════════════════════════════════════════════════

// Step1：観察プロンプト（構造化フォーマット固定版・再現性最優先）
const PROMPT_OBSERVE = `このスケッチ画像から数値と情報を抽出してください。
解釈や推測は不要です。画像に書かれた数字と記号をそのまま読み取ってください。

【読み取りルール】
- 画像に書かれた数字を全て読む（改ざん・丸め禁止）
- 「9」を「8」「0」と読まない。3桁の数字は必ず3桁で読む
- アイソメ図（立体スケッチ）の場合：水平2方向の大きい数=幅、小さい数=奥行き、縦方向=高さ
- 不明な項目は「不明」と書く

【回答は必ずこの形式のみで答える。他の文章は一切書かない】
タイトル：
幅(W)：mm
高さ(H)：mm
奥行き(D)：mm
板厚：mm
扉：あり／なし／不明
棚：あり／なし／不明
引き出し：あり／なし／不明`;

// Step2：JSON生成プロンプト（スキーマ完全固定版）
const makePromptJSON = (observation) => `以下の観察記録から家具JSONを生成してください。
JSONブロックのみ返答。説明文・コードブロック記号は不要。

【観察記録】
${observation}

【寸法の割り当て（絶対遵守）】
- overall_dimensions.width  = 観察記録の「幅(W)」の数値をそのまま使う
- overall_dimensions.height = 観察記録の「高さ(H)」の数値をそのまま使う
- overall_dimensions.depth  = 観察記録の「奥行き(D)」の数値をそのまま使う
- 数値を変更・丸め・入れ替え禁止

【部品の座標ルール（板厚=t として計算）】
収納BOX（W=外寸幅, H=外寸高さ, D=外寸奥行き, t=板厚）の場合：
- 天板：   width=W,   height=t,  depth=D,  position={x:0,   y:H-t, z:0}
- 底板：   width=W,   height=t,  depth=D,  position={x:0,   y:0,   z:0}
- 左側板： width=t,   height=H,  depth=D,  position={x:0,   y:0,   z:0}
- 右側板： width=t,   height=H,  depth=D,  position={x:W-t, y:0,   z:0}
- 背板：   width=W-t*2, height=H-t*2, depth=t, position={x:t, y:t, z:D-t}
- 扉：     width=W-t*2, height=H-t*2, depth=t, position={x:t, y:t, z:0}
- 棚板：   width=W-t*2, height=t,  depth=D-t*2, position={x:t, y:H/2, z:t}

【出力JSONスキーマ（このフォーマット厳守）】
{
  "furniture_name": "文字列",
  "material": "",
  "finish": "",
  "overall_dimensions": { "width": 数値, "height": 数値, "depth": 数値 },
  "components": [
    {
      "part_name": "文字列",
      "shape": "rect",
      "width": 数値,
      "height": 数値,
      "depth": 数値,
      "panel_thickness": 数値,
      "position": { "x": 数値, "y": 数値, "z": 数値 },
      "material": "",
      "grain_direction": "横目",
      "quantity": 1,
      "joint_method": "",
      "notes": ""
    }
  ]
}`;

// ══════════════════════════════════════════════════
// 観音扉ペア生成ユーティリティ
// UIは「観音扉」1オプション → 内部で左扉・右扉2コンポに展開
// ══════════════════════════════════════════════════
function makeDoorPair(W, H, D, chiri=3) {
  const t = 20;            // 框板厚
  const innerW = W - t*2; // 内寸幅
  const innerH = H - t*2; // 内寸高さ
  const halfW  = Math.floor(innerW / 2);
  const base = { shape:"rect", depth:t, panel_thickness:t,
    material:"", grain_direction:"縦目", quantity:1, joint_method:"蝶番", notes:"", chiri };
  return [
    { ...base, part_name:"左扉", width:halfW,          height:innerH, position:{x:t,          y:t, z:0} },
    { ...base, part_name:"右扉", width:innerW - halfW, height:innerH, position:{x:t + halfW,   y:t, z:0} },
  ];
}

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
  const [confirmDims, setConfirmDims] = useState(null); // 寸法確認UI用
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
  const loadRef = useRef(null); // プロジェクト読み込み用

  // 寸法UI：長押し・アニメーション・フォーカス用
  const [dimFocus,    setDimFocus]    = useState(null);
  const [dimAnimKey,  setDimAnimKey]  = useState(null);
  const longPressRef  = useRef(null);

  // チャット修正UI用
  const [chatInput,   setChatInput]   = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError,   setChatError]   = useState("");
  const [chatToast,   setChatToast]   = useState("");

  const parseChat = async () => {
    const text = chatInput.trim();
    if (!text || !confirmDims) return;
    setChatLoading(true); setChatError("");
    try {
      const currentDims = confirmDims.overall_dimensions || {};
      const currentComps = (confirmDims.components || []).map(c=>c.part_name).join("、") || "なし";
      const prompt = `あなたは家具図面のJSONを修正するアシスタントです。
現在の家具データ：
- 幅(W): ${currentDims.width}mm
- 高さ(H): ${currentDims.height}mm
- 奥行き(D): ${currentDims.depth}mm
- 部品: ${currentComps}

専門用語：
- ちり（散り）= 扉や引き出しの前板と框の端面の段差（mm）。例：ちり3mm
- 観音扉 = 左右2枚の扉が中央で合わさる扉形式
- 2段 / 3段 = 扉や引き出しの枚数（quantity）

ユーザーの修正指示：「${text}」

上記の指示に従って、以下のJSONを返してください。変更不要な項目は含めないでください。
必ずJSONのみを返し、説明文は不要です。

{
  "overall_dimensions": { "width": 数値, "height": 数値, "depth": 数値 },
  "add_parts": ["扉" | "引き出し" | "棚"],
  "remove_parts": ["扉" | "引き出し" | "棚"],
  "door_quantity": 扉の枚数（数値、変更ある場合のみ）,
  "door_chiri": ちりのmm数（数値、変更ある場合のみ）
}`;

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 300,
          messages: [{ role: "user", content: prompt }]
        })
      });
      const json = await res.json();
      if (!res.ok) throw new Error("API " + res.status);
      const raw = (json.content||[]).find(b=>b.type==="text")?.text || "";
      const m = raw.match(/\{[\s\S]*\}/);
      if (!m) throw new Error("解析失敗");
      const result = JSON.parse(m[0]);

      setConfirmDims(prev => {
        let next = { ...prev,
          overall_dimensions: {
            ...prev.overall_dimensions,
            ...result.overall_dimensions,
          }
        };

        // 部品追加
        (result.add_parts || []).forEach(partName => {
          const already = next.components?.some(c => c.part_name?.includes(partName));
          if (already) return;
          const W = next.overall_dimensions?.width || 800;
          const H = next.overall_dimensions?.height || 600;
          const D = next.overall_dimensions?.depth || 450;
          const t = 20;
          const partMap = {
            "扉": null, // makeDoorPairで個別処理
            "引き出し":{ part_name:"引き出し",shape:"rect", width:W-t*2, height:Math.round(H/3)-t, depth:D-t, panel_thickness:t, position:{x:t,y:t,z:0}, grain_direction:"横目", joint_method:"スライドレール" },
            "棚":     { part_name:"棚板",  shape:"rect", width:W-t*2, height:t, depth:D-t*2, panel_thickness:t, position:{x:t,y:Math.round(H/2),z:t}, grain_direction:"横目", joint_method:"棚ダボ" },
          };
          if (partName === "扉") {
            const chiri = result.door_chiri ?? 2;
            next = { ...next, components: [...(next.components||[]), ...makeDoorPair(W, H, D, chiri)] };
            return;
          }
          const newComp = partMap[partName];
          if (newComp) next = { ...next, components: [...(next.components||[]), { ...newComp, material:"", quantity:1, notes:"" }] };
        });

        // 部品削除
        (result.remove_parts || []).forEach(partName => {
          next = { ...next, components: next.components?.filter(c => !c.part_name?.includes(partName)) };
        });

        // 扉のquantity更新
        if (result.door_quantity != null) {
          next = { ...next, components: next.components?.map(c =>
            c.part_name?.includes("扉") ? { ...c, quantity: result.door_quantity } : c
          )};
        }

        // ちり更新
        if (result.door_chiri != null) {
          next = { ...next, components: next.components?.map(c =>
            c.part_name?.includes("扉") ? { ...c, chiri: result.door_chiri } : c
          )};
        }

        return next;
      });

      setChatInput("");

      // 反映内容をまとめてトースト表示
      const msgs = [];
      if (result.overall_dimensions) {
        const d = result.overall_dimensions;
        if (d.width)  msgs.push(`W ${d.width}mm`);
        if (d.height) msgs.push(`H ${d.height}mm`);
        if (d.depth)  msgs.push(`D ${d.depth}mm`);
      }
      (result.add_parts||[]).forEach(p => msgs.push(`${p}を追加`));
      (result.remove_parts||[]).forEach(p => msgs.push(`${p}を削除`));
      if (result.door_quantity) msgs.push(`扉 ${result.door_quantity}枚`);
      if (result.door_chiri)    msgs.push(`ちり ${result.door_chiri}mm`);
      const toastMsg = msgs.length > 0 ? `✓ 反映しました：${msgs.join(" / ")}` : "✓ 反映しました";
      setChatToast(toastMsg);
      setTimeout(() => setChatToast(""), 3000);
    } catch(e) {
      setChatError("うまく解釈できませんでした。もう少し具体的に入力してみてください。");
    }
    setChatLoading(false);
  };

  const startLongPress = (key, delta) => {
    // 即時1回
    setConfirmDims(prev => {
      if (!prev) return prev;
      return { ...prev, overall_dimensions: { ...prev.overall_dimensions, [key]: Math.max(1,(prev.overall_dimensions?.[key]||0)+delta) }};
    });
    triggerDimAnim(key);
    // 300ms後から100msごとに連続
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setConfirmDims(prev => {
          if (!prev) return prev;
          return { ...prev, overall_dimensions: { ...prev.overall_dimensions, [key]: Math.max(1,(prev.overall_dimensions?.[key]||0)+delta) }};
        });
        triggerDimAnim(key);
      }, 100);
      longPressRef.current = { timer: null, interval };
    }, 300);
    longPressRef.current = { timer, interval: null };
  };

  const stopLongPress = () => {
    if (!longPressRef.current) return;
    clearTimeout(longPressRef.current.timer);
    clearInterval(longPressRef.current.interval);
    longPressRef.current = null;
  };

  const triggerDimAnim = (key) => {
    setDimAnimKey(key + "_" + Date.now());
  };

  // 脚の寸法を自動補正（widthとdepthを正方形に統一）
  const fixLegDimensions = (parsed) => {
    if (!parsed?.components) return parsed;
    const OW = parsed.overall_dimensions?.width || 0;
    const OH = parsed.overall_dimensions?.height || 0;
    const OD = parsed.overall_dimensions?.depth || 0;

    const fixed = {
      ...parsed,
      components: parsed.components.flatMap(comp => {
        const name = comp.part_name || "";
        const isLeg = name.includes("脚") || name.toLowerCase().includes("leg");

        // 脚：正方形断面に統一
        if (isLeg && comp.shape !== "cylinder") {
          const legSize = Math.min(Math.max(comp.width || 60, comp.depth || 60), 120);
          return { ...comp, width: legSize, depth: legSize };
        }

        if (OW <= 0 || OH <= 0) return comp;

        // 板厚を推定（高さまたは幅の小さい方）
        const guessT = (n) => (n.includes("天板")||n.includes("底板")) ? (comp.height||20)
                             : (n.includes("左側板")||n.includes("右側板")) ? (comp.width||20)
                             : (n.includes("背板")) ? (comp.depth||20) : 20;
        const t = Math.min(guessT(name), 30); // 板厚上限30mm

        // 天板：幅=OW, x=0, y=OH-t
        if (name.includes("天板") && OW > 0) {
          return { ...comp, width: OW, height: t,
            position: { ...comp.position, x: 0, y: OH - t } };
        }
        // 底板：幅=OW, x=0, y=0
        if (name.includes("底板") && OW > 0) {
          return { ...comp, width: OW, height: t,
            position: { ...comp.position, x: 0, y: 0 } };
        }
        // 左側板：x=0, 高さ=OH
        if (name.includes("左側板") && OH > 0) {
          return { ...comp, height: OH,
            position: { ...comp.position, x: 0 } };
        }
        // 右側板：x=OW-板厚, 高さ=OH
        if (name.includes("右側板") && OW > 0 && OH > 0) {
          const tw = comp.width || 20;
          return { ...comp, height: OH,
            position: { ...comp.position, x: OW - tw } };
        }

        // 扉：「左扉」「右扉」はそのまま座標補正のみ
        if ((name.includes("左扉") || name.includes("右扉")) && OW > 0 && OH > 0) {
          const tw = 20;
          const halfW = Math.floor((OW - tw*2) / 2);
          const isRight = name.includes("右扉");
          return { ...comp,
            width: halfW,
            height: OH - tw*2,
            depth: tw,
            chiri: comp.chiri ?? 3,
            position: { x: isRight ? tw + halfW : tw, y: tw, z: 0 }
          };
        }

        // 扉（旧形式）：左扉・右扉ペアに展開フラグを立てる（後でflatMapで展開）
        if (name === "扉" && OW > 0 && OH > 0) {
          const tw = 20;
          return { ...comp,
            _expandToPair: true,  // ペア展開マーカー
            width: OW - tw*2,
            height: OH - tw*2,
            depth: tw,
            chiri: comp.chiri ?? 3,
            position: { x: tw, y: tw, z: 0 }
          };
        }

        // 棚板：depth=OD-板厚×2、z=板厚 に補正（外枠と重ならないように）
        if (name.includes("棚") && OD > 0) {
          const tw = 20;
          return { ...comp,
            width: comp.width || OW - tw*2,
            depth: OD - tw*2,
            position: { ...comp.position, z: tw }
          };
        }

        return comp;
      }).flatMap(comp => {
        // 旧形式「扉」をペアに展開
        if (comp._expandToPair) {
          const { _expandToPair, ...rest } = comp;
          const tw = 20;
          const OW2 = parsed.overall_dimensions?.width || 0;
          const OH2 = parsed.overall_dimensions?.height || 0;
          return makeDoorPair(OW2, OH2, parsed.overall_dimensions?.depth||0, rest.chiri ?? 3);
        }
        return [comp];
      })
    };
    return fixed;
  };

  const applyJson = (str) => {
    try {
      const parsed = fixLegDimensions(JSON.parse(str));
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
            temperature: 0,
            messages,
          })
        });
        const json = await res.json();
        if (!res.ok) throw new Error("API " + res.status + ": " + (json.error?.message || JSON.stringify(json)));
        return (json.content||[]).find(b=>b.type==="text")?.text || "";
      };

      // ── Step1：観察（BOX-first・アイソメ対応・寸法最優先） ──
      const observation = await call([{
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: imgType, data: imgB64 }},
          { type: "text",  text: PROMPT_OBSERVE }
        ]
      }], 1200);

      setLoadStep("図面データを生成中…");
      // ── Step2：JSON生成（寸法・扉・引き出し完全対応） ──
      const jsonText = await call([{
        role: "user",
        content: [{ type: "text", text: makePromptJSON(observation) }]
      }], 2500);

      const m = jsonText.match(/\{[\s\S]*\}/);
      if (!m) throw new Error("JSON取得失敗。返答: " + jsonText.slice(0,300));
      // ── 寸法確認UIを表示（fixLegDimensionsは確定後に実行）──
      const parsed = JSON.parse(m[0]);
      const pretty = JSON.stringify(parsed, null, 2);
      setRawJson(pretty); setJsonEdit(pretty);
      setConfirmDims(parsed);
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
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const downloadPDF = () => {
    if (!svgRef.current) return;
    const xml = new XMLSerializer().serializeToString(svgRef.current);
    const svgBlob = new Blob([xml], {type:"image/svg+xml;charset=utf-8"});
    const url = URL.createObjectURL(svgBlob);
    // iframeで印刷（ポップアップブロック回避）
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    document.body.appendChild(iframe);
    iframe.contentDocument.write(`<!DOCTYPE html><html><head>
      <title>${data?.furniture_name||"図面"}</title>
      <style>
        @page { size: A3 landscape; margin: 10mm; }
        body { margin:0; padding:0; display:flex; justify-content:center; align-items:center; min-height:100vh; background:#fff; }
        img { max-width:100%; max-height:100vh; }
        @media print { body { min-height:unset; } }
      </style>
    </head><body>
      <img src="${url}" onload="window.print(); window.onafterprint=()=>document.body.removeChild(this.closest('iframe'))"/>
    </body></html>`);
    iframe.contentDocument.close();
  };

  // ── プロジェクト保存 ──
  const saveProject = () => {
    if (!data) return;
    const project = {
      projectName: data.furniture_name || "プロジェクト",
      savedAt: new Date().toISOString(),
      data: data
    };
    const blob = new Blob([JSON.stringify(project, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${data.furniture_name || "project"}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // ── プロジェクト読み込み ──
  const loadProject = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const project = JSON.parse(e.target.result);
        // 新旧フォーマット両対応
        const loaded = project.data || project;
        if (!loaded.overall_dimensions) throw new Error("無効なプロジェクトファイルです");
        const fixed = fixLegDimensions(loaded);
        const pretty = JSON.stringify(fixed, null, 2);
        setData(fixed);
        setRawJson(pretty);
        setJsonEdit(pretty);
        setTab("2d");
      } catch(e) {
        setError("読み込みエラー：" + e.message);
      }
    };
    reader.readAsText(file);
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

  // 部品個別の寸法変更（2D図面上のクリック編集用）
  const handleCompDimChange = (idx, field, val) => {
    if (!data) return;
    const updated = {
      ...data,
      components: data.components.map((c, i) =>
        i === idx ? { ...c, [field]: val } : c
      )
    };
    setData(updated);
    const s = JSON.stringify(updated, null, 2);
    setRawJson(s); setJsonEdit(s);
  };

  const TABS = [
    { key:"2d",       label:"2D図面（JIS）" },
    { key:"3d",       label:"3Dモデル" },
    { key:"parts",    label:"📋 部品図" },
    { key:"bom",      label:"部品表" },
    { key:"estimate", label:"💴 見積" },
    { key:"edit",     label:"✏️ かんたん編集" },
    { key:"json",     label:"JSON（上級者向け）" },
  ];

  const od = data?.overall_dimensions || {};

  return (
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:SANS,color:C.text}}>
      {/* ヘッダー */}
      <div style={{background:C.panel,borderBottom:`1px solid ${C.border}`,padding:"11px 20px",display:"flex",alignItems:"center",gap:16}}>
        <div>
          <div style={{fontSize:17,fontWeight:900,letterSpacing:6}}>赤 装</div>
          <div style={{fontSize:8,color:C.sub,letterSpacing:2,marginTop:1}}>MOKKOUJYO — PROFESSIONAL DRAWING SYSTEM v24</div>
        </div>
        <div style={{width:1,height:30,background:C.border2}}/>
        <div style={{fontSize:10,color:C.sub}}>汎用コンポーネント方式 | 曲線対応 | JIS B 0001 第三角法</div>
        {data && (
          <div style={{marginLeft:"auto",display:"flex",gap:8,alignItems:"center"}}>
            {/* Save / Load ボタン */}
            <button onClick={saveProject}
              style={{padding:"6px 14px",background:"#2d333b",color:C.ok,border:`1px solid ${C.ok}`,borderRadius:5,fontSize:11,fontWeight:600,cursor:"pointer"}}>
              💾 保存
            </button>
            <label style={{padding:"6px 14px",background:"#2d333b",color:C.warn,border:`1px solid ${C.warn}`,borderRadius:5,fontSize:11,fontWeight:600,cursor:"pointer"}}>
              📂 読込
              <input ref={loadRef} type="file" accept=".json" style={{display:"none"}}
                onChange={e=>{loadProject(e.target.files[0]); e.target.value="";}}/>
            </label>
            <div style={{width:1,height:20,background:C.border2}}/>
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
                  <div style={{fontSize:9,color:C.ok,marginTop:6,lineHeight:1.7}}>
                    💡 精度UP のコツ<br/>品名と寸法を書いてね
                  </div>
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
                  <Drawing2D data={data} svgRef={svgRef} onDimChange={handleDimChange} onCompDimChange={handleCompDimChange}/>
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

              {tab==="parts" && <PartDrawings data={data}/>}

              {tab==="estimate" && <MaterialEngine data={data}/>}

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

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeInUp { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
      `}</style>

      {/* ── 寸法確認モーダル（Human-in-the-loop / iPad最適化）── */}
      {confirmDims && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:1000}}>
          <div style={{
            background:C.panel,
            border:`1px solid ${C.border2}`,
            borderRadius:"20px 20px 0 0",
            padding:"24px 20px 36px",
            width:"100%",
            maxWidth:640,
            boxShadow:"0 -8px 48px rgba(0,0,0,0.6)",
            maxHeight:"92vh",
            overflowY:"auto",
          }}>
            {/* ハンドル */}
            <div style={{width:40,height:4,background:C.border2,borderRadius:2,margin:"0 auto 20px"}}/>

            {/* タイトル + 家具名 */}
            <div style={{display:"flex",alignItems:"baseline",gap:10,marginBottom:4}}>
              <div style={{fontSize:16,fontWeight:800,color:C.accent}}>📐 寸法を確認</div>
              <div style={{fontSize:13,fontWeight:700,color:C.text}}>{confirmDims.furniture_name}</div>
            </div>
            <div style={{fontSize:11,color:C.sub,marginBottom:16}}>AIの推定値です。正しい数値に修正してから確定してください。</div>

            {/* ── チャット修正UI ── */}
            <div style={{marginBottom:22}}>
              <div style={{display:"flex",gap:6,alignItems:"stretch"}}>

                {/* テキスト入力 */}
                <div style={{flex:1, position:"relative"}}>
                  <input
                    type="text"
                    value={chatInput}
                    onChange={e=>{setChatInput(e.target.value);setChatError("");}}
                    onKeyDown={e=>{ if(e.key==="Enter" && !e.shiftKey){ e.preventDefault(); parseChat(); }}}
                    placeholder="例：幅800 / 引き出し2段（Macの音声入力も使えます）"
                    disabled={chatLoading}
                    style={{
                      width:"100%", boxSizing:"border-box",
                      padding:"13px 16px",
                      background:"#0d1117",
                      border:`1.5px solid ${chatError ? C.err : chatInput ? C.accent : C.border2}`,
                      borderRadius:10,
                      color:C.text,
                      fontSize:14, fontFamily:SANS,
                      outline:"none",
                      transition:"all 0.15s",
                      opacity: chatLoading ? 0.6 : 1,
                    }}
                  />
                </div>

                {/* 反映ボタン */}
                <button
                  onClick={parseChat}
                  disabled={!chatInput.trim() || chatLoading}
                  style={{
                    padding:"13px 18px",
                    background: chatInput.trim() && !chatLoading ? C.accent2 : "#21262d",
                    color: chatInput.trim() && !chatLoading ? "#fff" : C.sub,
                    border:"none", borderRadius:10,
                    fontSize:13, fontWeight:700,
                    cursor: chatInput.trim() ? "pointer" : "default",
                    flexShrink:0,
                    transition:"background 0.15s, color 0.15s",
                    minWidth:60,
                  }}>
                  {chatLoading
                    ? <span style={{display:"inline-block",width:14,height:14,border:`2px solid ${C.border2}`,borderTopColor:"#fff",borderRadius:"50%",animation:"spin .6s linear infinite"}}/>
                    : "反映"}
                </button>
              </div>

              {chatError && (
                <div style={{marginTop:6,fontSize:11,color:C.err,paddingLeft:2}}>{chatError}</div>
              )}
              {chatToast && (
                <div style={{
                  marginTop:8, padding:"10px 14px",
                  background:"#0f2d1a", border:`1px solid ${C.ok}`,
                  borderRadius:8, color:C.ok,
                  fontSize:12, fontWeight:600,
                  animation:"fadeInUp 0.2s ease-out",
                }}>
                  {chatToast}
                </div>
              )}
            </div>

            {/* ── W / H / D 一体型コントロール（7ボタン横一列）── */}
            <style>{`
              @keyframes dimFlash {
                0%   { color: #fff; transform: scale(1.06); }
                100% { color: #79c0ff; transform: scale(1); }
              }
              .dim-value-anim { animation: dimFlash 0.16s ease-out; }
              .dim-btn-main:active  { transform: scale(0.90) !important; filter: brightness(1.3); }
              .dim-btn-sub:active   { opacity: 1 !important; filter: brightness(1.2); }
              .dim-btn-micro:active { opacity: 1 !important; filter: brightness(1.2); }
              input[type=number]::-webkit-inner-spin-button,
              input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
            `}</style>
            <div style={{display:"flex",flexDirection:"column",gap:16,marginBottom:24}}>
              {[
                ["W", "width",  "幅"],
                ["H", "height", "高さ"],
                ["D", "depth",  "奥行き"],
              ].map(([letter, key, hint]) => {
                const val = confirmDims.overall_dimensions?.[key] || 0;
                const isFocused = dimFocus === key;
                const animClass = dimAnimKey?.startsWith(key) ? "dim-value-anim" : "";

                // ボタン定義：[delta, label, tier]
                // tier: "sub"=薄め / "main"=主操作 / "micro"=±1
                const BTNS = [
                  [-50, "−50", "sub"],
                  [-10, "−10", "main"],
                  [ -1, "−1",  "micro"],
                  [ +1, "+1",  "micro"],
                  [+10, "+10", "main"],
                  [+50, "+50", "sub"],
                ];

                const btnStyle = (tier) => {
                  if (tier === "main") return {
                    height:64, border:"none", borderRadius:10, cursor:"pointer",
                    background: isFocused ? "#223060" : "#1a2040",
                    color: C.accent,
                    fontSize:15, fontFamily:MONO, fontWeight:800,
                    transition:"background 0.12s, transform 0.08s",
                    userSelect:"none", WebkitUserSelect:"none", touchAction:"none",
                  };
                  if (tier === "micro") return {
                    height:64, border:`1.5px solid ${C.border2}`, borderRadius:10, cursor:"pointer",
                    background: isFocused ? "#161e30" : "#13181f",
                    color: "#5080b0",
                    fontSize:13, fontFamily:MONO, fontWeight:700,
                    transition:"background 0.12s, transform 0.08s",
                    userSelect:"none", WebkitUserSelect:"none", touchAction:"none",
                  };
                  // sub
                  return {
                    height:64, border:`1px solid ${C.border}`, borderRadius:10, cursor:"pointer",
                    background:"transparent",
                    color: C.sub,
                    fontSize:13, fontFamily:MONO, fontWeight:600,
                    opacity:0.45,
                    transition:"opacity 0.1s, transform 0.08s",
                    userSelect:"none", WebkitUserSelect:"none", touchAction:"none",
                  };
                };

                return (
                  <div key={key}
                    onPointerEnter={()=>setDimFocus(key)}
                    onPointerLeave={()=>setDimFocus(null)}
                    style={{
                      borderRadius:14,
                      padding:"10px 10px 10px",
                      background: isFocused ? "#1a2035" : "transparent",
                      border:`1.5px solid ${isFocused ? C.accent2 : "transparent"}`,
                      transition:"background 0.15s, border-color 0.15s",
                    }}>

                    {/* ラベル */}
                    <div style={{display:"flex",alignItems:"baseline",gap:6,marginBottom:8,paddingLeft:2}}>
                      <span style={{fontSize:16,fontWeight:900,color:isFocused?C.accent:C.sub,fontFamily:MONO,transition:"color 0.15s"}}>{letter}</span>
                      <span style={{fontSize:11,color:C.sub}}>{hint}</span>
                    </div>

                    {/* 7ボタン横一列：−50 −10 −1 [数値] +1 +10 +50 */}
                    <div style={{display:"grid",gridTemplateColumns:"44px 52px 44px 1fr 44px 52px 44px",gap:4,alignItems:"stretch"}}>
                      {BTNS.slice(0,3).map(([d, label, tier]) => (
                        <button key={d}
                          className={`dim-btn-${tier}`}
                          onPointerDown={()=>startLongPress(key, d)}
                          onPointerUp={stopLongPress}
                          onPointerLeave={stopLongPress}
                          onContextMenu={e=>e.preventDefault()}
                          style={btnStyle(tier)}>
                          {label}
                        </button>
                      ))}

                      {/* 数値（中央・主役） */}
                      <div style={{position:"relative"}}>
                        <input
                          key={animClass}
                          className={animClass}
                          type="number" inputMode="numeric"
                          value={val}
                          onFocus={()=>setDimFocus(key)}
                          onBlur={()=>setDimFocus(null)}
                          onChange={e=>{
                            setConfirmDims(prev=>({
                              ...prev,
                              overall_dimensions:{...prev.overall_dimensions,[key]:+e.target.value}
                            }));
                            triggerDimAnim(key);
                          }}
                          style={{
                            width:"100%", height:64, boxSizing:"border-box",
                            background:"#0d1117",
                            border:`2.5px solid ${isFocused ? C.accent : C.border2}`,
                            borderRadius:10,
                            color:"#79c0ff",
                            fontSize:26, fontFamily:MONO, fontWeight:800,
                            textAlign:"center", outline:"none",
                            WebkitAppearance:"none", MozAppearance:"textfield",
                            transition:"border-color 0.15s",
                          }}
                        />
                        <span style={{position:"absolute",right:5,bottom:6,fontSize:9,color:C.sub,pointerEvents:"none"}}>mm</span>
                      </div>

                      {BTNS.slice(3).map(([d, label, tier]) => (
                        <button key={d}
                          className={`dim-btn-${tier}`}
                          onPointerDown={()=>startLongPress(key, d)}
                          onPointerUp={stopLongPress}
                          onPointerLeave={stopLongPress}
                          onContextMenu={e=>e.preventDefault()}
                          style={btnStyle(tier)}>
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── 部品の追加・削除 ── */}
            <div style={{marginBottom:22}}>
              <div style={{fontSize:11,color:C.sub,marginBottom:10}}>部品の追加・削除</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
                {[
                  {
                    label:"扉", icon:"🚪",
                    check: d => d.components?.some(c=>c.part_name?.includes("扉")),
                    add: d => {
                      const W = d.overall_dimensions?.width || 800;
                      const H = d.overall_dimensions?.height || 600;
                      const D = d.overall_dimensions?.depth || 450;
                      return { ...d, components: [...(d.components||[]), ...makeDoorPair(W, H, D, 2)] };
                    },
                    remove: d => ({...d, components: d.components?.filter(c=>!c.part_name?.includes("扉"))})
                  },
                  {
                    label:"引き出し", icon:"📦",
                    check: d => d.components?.some(c=>c.part_name?.includes("引き出し")),
                    add: d => {
                      const W = d.overall_dimensions?.width || 800;
                      const H = d.overall_dimensions?.height || 600;
                      const D = d.overall_dimensions?.depth || 450;
                      const t = 20;
                      return { ...d, components: [...(d.components||[]), {
                        part_name:"引き出し", shape:"rect", width:W-t*2, height:Math.round(H/3)-t, depth:D-t,
                        panel_thickness:t, position:{x:t,y:t,z:0},
                        material:"", grain_direction:"横目", quantity:1, joint_method:"スライドレール", notes:""
                      }]};
                    },
                    remove: d => ({...d, components: d.components?.filter(c=>!c.part_name?.includes("引き出し"))})
                  },
                  {
                    label:"棚", icon:"📋",
                    check: d => d.components?.some(c=>c.part_name?.includes("棚")),
                    add: d => {
                      const W = d.overall_dimensions?.width || 800;
                      const H = d.overall_dimensions?.height || 600;
                      const D = d.overall_dimensions?.depth || 450;
                      const t = 20;
                      return { ...d, components: [...(d.components||[]), {
                        part_name:"棚板", shape:"rect", width:W-t*2, height:t, depth:D-t*2,
                        panel_thickness:t, position:{x:t,y:Math.round(H/2),z:t},
                        material:"", grain_direction:"横目", quantity:1, joint_method:"棚ダボ", notes:""
                      }]};
                    },
                    remove: d => ({...d, components: d.components?.filter(c=>!c.part_name?.includes("棚"))})
                  },
                ].map(({label, icon, check, add, remove}) => {
                  const active = check(confirmDims);
                  return (
                    <button key={label}
                      onClick={() => setConfirmDims(active ? remove(confirmDims) : add(confirmDims))}
                      style={{
                        padding:"14px 8px",
                        borderRadius:10,
                        fontSize:13,
                        fontWeight:700,
                        cursor:"pointer",
                        textAlign:"center",
                        background: active ? C.ok+"22" : "#21262d",
                        border: `1.5px solid ${active ? C.ok : C.border2}`,
                        color: active ? C.ok : C.sub,
                        display:"flex", flexDirection:"column", alignItems:"center", gap:4,
                      }}>
                      <span style={{fontSize:20}}>{icon}</span>
                      <span>{active ? `✓ ${label}` : `＋ ${label}`}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── 確定ボタン ── */}
            <div style={{display:"flex",gap:10}}>
              <button
                onClick={() => {
                  const fixed = fixLegDimensions(confirmDims);
                  const pretty = JSON.stringify(fixed, null, 2);
                  setRawJson(pretty); setJsonEdit(pretty);
                  setData(fixed);
                  setConfirmDims(null);
                  setTab("2d");
                }}
                style={{flex:1,padding:"16px",background:C.accent2,color:"#fff",border:"none",borderRadius:12,fontSize:15,fontWeight:800,cursor:"pointer",letterSpacing:1}}>
                ✓ この寸法で図面生成
              </button>
              <button
                onClick={() => setConfirmDims(null)}
                style={{padding:"16px 20px",background:"#21262d",color:C.sub,border:`1px solid ${C.border2}`,borderRadius:12,fontSize:13,cursor:"pointer",fontWeight:600}}>
                戻る
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
