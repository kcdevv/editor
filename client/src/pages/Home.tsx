import { useRef } from "react"

const Home = () => {
    const roomIdref = useRef<HTMLInputElement>(null)
  return (
    <div>
        <input type="text" ref={roomIdref} />
        <button onClick={()=>console.log(roomIdref.current?.value)}>Join</button>
    </div>
  )
}

export default Home