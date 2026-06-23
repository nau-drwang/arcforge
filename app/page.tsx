import Image from "next/image";
import Link from "next/link";

const artworks = [
  {
    title: "灰烬战斧领主",
    price: "$420",
    material: "手绘树脂 / 金属旧化",
    scale: "32 cm",
    tag: "现货 1 件",
    description: "重甲、披风和岩石底座做旧处理，适合收藏柜中央陈列。",
  },
  {
    title: "月晶秘法师",
    price: "$360",
    material: "半透明树脂 / 冷光漆",
    scale: "28 cm",
    tag: "预订制作",
    description: "法杖和晶体以低饱和蓝绿呈现，强调手工笔触和层次。",
  },
  {
    title: "翼誓守卫",
    price: "$510",
    material: "树脂 / 仿石底座",
    scale: "35 cm",
    tag: "限量 3 件",
    description: "展开翼片和长枪形成竖向轮廓，适合高柜或独立展台。",
  },
];

const stack = [
  "前端: Sites / React / Tailwind",
  "后端: Cloudflare D1 免费额度保存作品与订单",
  "媒体: Cloudflare R2 免费额度保存照片与视频",
  "网址: 免费 Sites/Workers 子域名",
  "支付: Stripe 或 PayPal 链接，服务商会收交易手续费",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f6f4ef] text-[#201d1a]">
      <header className="border-b border-[#d8d0c2] bg-[#f6f4ef]/95">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Link href="/" className="text-lg font-semibold">
            Arcforge Studio
          </Link>
          <div className="flex items-center gap-2 text-sm">
            <Link
              href="/admin"
              className="border border-[#8b806f] px-3 py-2 hover:bg-[#ebe5da]"
            >
              管理
            </Link>
            <Link
              href="/checkout"
              className="bg-[#1f3f3c] px-3 py-2 text-white hover:bg-[#2d5a55]"
            >
              支付
            </Link>
          </div>
        </nav>
      </header>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 pb-10 pt-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div className="space-y-6">
          <p className="text-sm uppercase tracking-[0.18em] text-[#776a59]">
            Original fantasy sculpture shop
          </p>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight sm:text-6xl">
            原创幻想英雄雕塑展示与售卖网站
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-[#5d554b]">
            用于展示手工雕塑作品、价格、照片和视频，并预留管理员批量上传、订单和第三方支付入口。
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="#gallery"
              className="bg-[#a94f35] px-5 py-3 font-medium text-white hover:bg-[#8f432e]"
            >
              浏览作品
            </Link>
            <Link
              href="/admin"
              className="border border-[#8b806f] px-5 py-3 font-medium hover:bg-[#ebe5da]"
            >
              进入管理员界面
            </Link>
          </div>
        </div>
        <div className="relative aspect-[16/11] overflow-hidden border border-[#c6baa6] bg-[#dfd7c9]">
          <Image
            src="/hero-sculptures.png"
            alt="原创幻想英雄雕塑展示"
            fill
            unoptimized
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </section>

      <section id="gallery" className="border-y border-[#d8d0c2] bg-[#ebe5da]">
        <div className="mx-auto max-w-7xl px-5 py-10">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-3xl font-semibold">作品展示</h2>
              <p className="mt-2 text-[#5d554b]">
                样品数据，接入后台后由 D1/R2 自动读取。
              </p>
            </div>
            <Link href="/checkout" className="text-sm font-semibold text-[#1f3f3c] underline">
              查看支付页
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {artworks.map((artwork) => (
              <article key={artwork.title} className="border border-[#c6baa6] bg-[#f9f7f2]">
                <div className="relative aspect-[4/3] overflow-hidden bg-[#d9d0c0]">
                  <Image
                    src="/hero-sculptures.png"
                    alt={artwork.title}
                    fill
                    unoptimized
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="space-y-4 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-xl font-semibold">{artwork.title}</h3>
                    <span className="whitespace-nowrap text-lg font-semibold text-[#a94f35]">
                      {artwork.price}
                    </span>
                  </div>
                  <p className="text-sm leading-6 text-[#5d554b]">{artwork.description}</p>
                  <dl className="grid grid-cols-2 gap-3 border-t border-[#d8d0c2] pt-4 text-sm">
                    <div>
                      <dt className="text-[#776a59]">材质</dt>
                      <dd className="mt-1 font-medium">{artwork.material}</dd>
                    </div>
                    <div>
                      <dt className="text-[#776a59]">高度</dt>
                      <dd className="mt-1 font-medium">{artwork.scale}</dd>
                    </div>
                  </dl>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-[#776a59]">{artwork.tag}</span>
                    <Link
                      href={`/checkout?artwork=${encodeURIComponent(artwork.title)}`}
                      className="bg-[#1f3f3c] px-4 py-2 text-sm font-medium text-white hover:bg-[#2d5a55]"
                    >
                      购买
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <h2 className="text-3xl font-semibold">免费部署建议</h2>
          <p className="mt-3 leading-7 text-[#5d554b]">
            可以做到前端、后端和子域名免费起步。需要注意的是，支付平台通常不收月费，但会按交易扣手续费。
          </p>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2">
          {stack.map((item) => (
            <li key={item} className="border border-[#d8d0c2] bg-white/45 p-4 text-sm leading-6">
              {item}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
