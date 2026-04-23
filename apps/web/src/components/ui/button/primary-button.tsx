import { Button } from "@/components/ui/button"

export function PrimaryButton(props) {
  return (
    <Button
      {...props}
      className={`rounded-2xl bg-[linear-gradient(135deg,#1D4ED8_0%,#DC2626_100%)] text-white hover:opacity-95 ${props.className ?? ""}`}
    />
  )
}