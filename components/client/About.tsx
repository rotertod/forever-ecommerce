import Image from 'next/image';
import Title from './helper/Title';
import { assets } from '@/public/client/assets';
import NewsletterBox from './home/NewsletterBox';

export default function About() {
    return (
        <div>
            {/* heading */}
            <div className="text-2xl text-center pt-8 border-t">
                <Title text1="VỀ" text2="CHÚNG TÔI" />
            </div>
            {/* content */}
            <div className="my-10 flex flex-col md:flex-row gap-16">
                {/* image */}
                <Image src={assets.about_img} alt="about" className="w-full md:max-w-[450px]" />
                {/* text */}
                <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod optio deserunt id, enim quis
                        facilis fugit totam blanditiis vitae quaerat, accusamus pariatur odit maiores dolorem! Aliquam,
                        alias magnam rerum odio doloremque autem molestias laborum. Rerum sapiente molestias mollitia
                        inventore repudiandae!
                    </p>
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore aspernatur consectetur velit
                        sunt nam ea aliquid dignissimos molestiae hic ratione dolorum sequi doloremque, autem aliquam
                        quia alias deserunt. Nostrum labore repudiandae impedit accusantium dolore assumenda tempore
                        possimus adipisci nisi ab distinctio totam in dolorum alias magni, nihil, sequi voluptatem
                        cupiditate nam unde dicta. Commodi minima ut quod labore iure vel!
                    </p>
                    <b className="text-gray-800">Nhiệm vụ của chúng tôi</b>
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur magni nam obcaecati sed
                        quasi debitis modi! Sequi commodi et odio. Laborum temporibus iste minima placeat perferendis,
                        iure illo veritatis facilis?
                    </p>
                </div>
            </div>
            {/* why choose us */}
            <div className="text-xl py-4">
                <Title text1="TẠI SAO" text2="CHỌN CHÚNG TÔI" />
            </div>
            <div className="flex flex-col md:flex-row text-sm mb-20">
                <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
                    <b>Đảm bảo chất lượng: </b>
                    <p className="text-gray-600">
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptatum eveniet excepturi
                        voluptate!
                    </p>
                </div>
                <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
                    <b>Sự tiện lợi: </b>
                    <p className="text-gray-600">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Atque.</p>
                </div>
                <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
                    <b>Dịch vụ khách hàng đặc biệt: </b>
                    <p className="text-gray-600">
                        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ea pariatur dolorem similique quo
                        quibusdam vitae cum, libero suscipit aut soluta.
                    </p>
                </div>
            </div>

            <NewsletterBox />
        </div>
    );
}
