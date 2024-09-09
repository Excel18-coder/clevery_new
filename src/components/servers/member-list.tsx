import { Text } from "@/components/themed";
import { Modal } from "@/components/ui/modal";
import MembersComponent from "./members";

interface Props {
  label: string;
  images: string[];
}
export default function MembersList({ label, images }: Props) {
  return (
    <Modal className='mt-10' >
      <Text>{label}</Text>
      <MembersComponent userImages={images} />
    </Modal>
  )
}