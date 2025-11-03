import Link from 'next/link'
export default function Home(){
  return (
    <div className='card'>
      <h2>Welcome</h2>
      <p>Choose a portal to continue:</p>
      <div className='row'>
        <Link className='btn primary' href='/login?as=admin'>Admin</Link>
        <Link className='btn ghost' href='/login?as=owner'>Owner</Link>
      </div>
    </div>
  )
}
