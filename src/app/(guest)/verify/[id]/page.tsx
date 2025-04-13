import Verify from "@/components/auth/verify";

const VerifyPage = ({ params }: { params: { id: string } }) => {
    return (
        <div>
            <Verify
                _id={params.id}
            />
        </div>
    );
};

export default VerifyPage;