import BedIcon from "./BedIcon"
import UserIcon from "./UserIcon"
import WifiIcon from "./WifiIcon"

export default function MasterIcon({ data }) {
    switch (data) {
        case 'person':
            return <UserIcon />
        case 'bed':
            return <BedIcon />
        default:
            return <WifiIcon />
    }
}