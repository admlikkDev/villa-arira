import { Book, ChevronRightIcon, Pencil, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useNavigate } from "react-router-dom"

export function GlobalCardList({ data = null }) {
    const featureName = data?.title
    const navigate = useNavigate()

    return (
        <Card size="sm" className="mx-auto w-full max-w-xs p-5 m-5">
            <CardHeader>
                <CardTitle>{featureName}</CardTitle>
                <CardDescription>
                    {data?.subtitle}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ul className="grid gap-2 py-2 text-sm">
                    {
                        data?.lists?.map(item => (
                            <li className="flex gap-2">
                                <ChevronRightIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                                <span>{item?.text ?? '-'}</span>
                            </li>
                        ))
                    }
                </ul>
            </CardContent>
            <CardFooter className="grid gap-2">
                <div className="flex gap-2">
                    <Button type="button" size="sm" className="w-1/2 bg-indigo-600 hover:bg-indigo-700 p-5" >
                        <Pencil />
                        Edit
                    </Button>
                    <Button type='button' size="sm" className="w-1/2 bg-indigo-600 hover:bg-indigo-700 p-5" onClick={() => navigate(`/package/${data?.id}`)}>
                        <Book />
                        Detail
                    </Button>
                </div>
                <Button variant="outline" size="sm" className="w-full p-5 bg-red-600 hover:bg-red-700 text-white hover:text-white">
                    <Trash />
                    Delete
                </Button>
            </CardFooter>
        </Card>
    )
}
