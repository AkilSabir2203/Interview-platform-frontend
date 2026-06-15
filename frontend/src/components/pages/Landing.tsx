import Typewriter from 'typewriter-effect';

const Landing = () => {
  return (
    <div className="inset-0 font-satoshi h-70 pb-12 w-full text-white text-6xl px-5 py-24 flex justify-center items-center [background:radial-gradient(125%_125%_at_50%_10%,#000_60%,#7b2cbf_100%)]">
        <Typewriter
        options={{
            strings: [
                '<span class="text-green-400">Crush</span> the technical round !', 
                'Interview with <span class="text-green-400">confidence</span>.'
            ],
            autoStart: true,
            loop: true,
        }}
        />
    </div>
  )
}

export default Landing;