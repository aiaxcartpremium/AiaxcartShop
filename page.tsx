'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

type SummaryRow = { product:string; account_type:string; months:number; available:number; min_price:number|null; max_price:number|null }

export default function Admin(){
  const [rows,setRows]=useState<SummaryRow[]>([])
  const [msg,setMsg]=useState('')
  const [holdId,setHoldId]=useState<string|null>(null)
  const [holdUntil,setHoldUntil]=useState<string>('')
  const [creds,setCreds]=useState<any>(null)

  useEffect(()=>{ load() },[])
  async function load(){
    const { data } = await supabase.from('admin_summary').select('*').order('product')
    setRows(data||[])
  }

  async function hold(product:string, type:string, months:number){
    setMsg(''); setCreds(null); setHoldId(null)
    const { data, error } = await supabase.rpc('create_hold', { p_product:product, p_type:type, p_months:months, p_minutes: 3 })
    if(error || !data){ setMsg(error?.message || 'No available'); return }
    setHoldId(data.id); setHoldUntil(data.expires_at)
    setMsg('Hold created. Confirm to reveal.')
  }
  async function confirm(){
    if(!holdId) return
    const { data, error } = await supabase.rpc('confirm_hold', { p_hold_id: holdId })
    if(error){ setMsg(error.message); return }
    setCreds(data)
    setMsg('Confirmed. Credentials revealed.')
    await load()
  }
  async function cancelHold(){
    if(!holdId) return
    await supabase.rpc('cancel_hold', { p_hold_id: holdId })
    setHoldId(null); setCreds(null); setMsg('Hold cancelled.')
  }

  return (
    <div className='card'>
      <h3>Admin — Browse & Claim</h3>
      <table className='table'>
        <thead><tr><th>Product</th><th>Type</th><th>Term</th><th>Avail</th><th>Price Range</th><th></th></tr></thead>
        <tbody>
          {rows.map((r,i)=>(
            <tr key={i}>
              <td>{r.product}</td>
              <td>{r.account_type}</td>
              <td>{r.months}d</td>
              <td>{r.available}</td>
              <td>{r.min_price??'-'} – {r.max_price??'-'}</td>
              <td><button className='btn primary' disabled={r.available<=0} onClick={()=>hold(r.product, r.account_type, r.months)}>Get (Hold)</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <hr className='sep'/>
      {holdId && <div className='card'>
        <h4>Hold #{holdId.slice(0,8)} (until {new Date(holdUntil).toLocaleTimeString()})</h4>
        {!creds ? (
          <div className='row'>
            <button className='btn primary' onClick={confirm}>Confirm & Reveal</button>
            <button className='btn' onClick={cancelHold}>Cancel</button>
          </div>
        ) : (
          <div>
            <p>Copy credentials now:</p>
            <div className='row'>
              <div><div className='label'>Email</div><div>{creds.email||'-'}</div></div>
              <div><div className='label'>Password</div><div>{creds.password||'-'}</div></div>
              <div><div className='label'>Profile</div><div>{creds.profile||'-'}</div></div>
              <div><div className='label'>PIN</div><div>{creds.pin||'-'}</div></div>
            </div>
          </div>
        )}
        <p style={{fontSize:12,color:'#7f6b84',marginTop:8}}>Record buyer & price in Records.</p>
      </div>}
      {msg && <p style={{marginTop:8}}>{msg}</p>}
      <hr className='sep'/>
      <a className='btn' href='/admin/records'>Go to My Records</a>
    </div>
  )
}
