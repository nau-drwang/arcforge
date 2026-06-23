import Link from "next/link";

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-[#f6f4ef] px-5 py-6 text-[#201d1a]">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex flex-col gap-3 border-b border-[#d8d0c2] pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link href="/" className="text-sm text-[#1f3f3c] underline">
              返回商店
            </Link>
            <h1 className="mt-3 text-3xl font-semibold">管理员界面</h1>
          </div>
          <button className="w-fit bg-[#1f3f3c] px-4 py-2 font-medium text-white">
            保存作品
          </button>
        </header>

        <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
          <form className="space-y-5 border border-[#c6baa6] bg-white/55 p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium">
                作品名称
                <input className="border border-[#c6baa6] bg-white px-3 py-2" name="title" defaultValue="灰烬战斧领主" />
              </label>
              <label className="grid gap-2 text-sm font-medium">
                价格 USD
                <input className="border border-[#c6baa6] bg-white px-3 py-2" name="price" defaultValue="420" inputMode="decimal" />
              </label>
              <label className="grid gap-2 text-sm font-medium">
                材质
                <input className="border border-[#c6baa6] bg-white px-3 py-2" name="material" defaultValue="手绘树脂 / 金属旧化" />
              </label>
              <label className="grid gap-2 text-sm font-medium">
                库存
                <input className="border border-[#c6baa6] bg-white px-3 py-2" name="inventory" defaultValue="1" inputMode="numeric" />
              </label>
            </div>
            <label className="grid gap-2 text-sm font-medium">
              作品描述
              <textarea
                className="min-h-28 border border-[#c6baa6] bg-white px-3 py-2"
                name="description"
                defaultValue="原创幻想人物雕塑，适合收藏柜、展台和主题空间陈列。"
              />
            </label>
            <label className="grid gap-3 border border-dashed border-[#8b806f] bg-[#f9f7f2] p-5 text-sm font-medium">
              批量上传照片和视频
              <input
                className="w-full border border-[#c6baa6] bg-white px-3 py-2"
                name="media"
                type="file"
                multiple
                accept="image/*,video/*"
              />
              <span className="text-xs font-normal leading-5 text-[#776a59]">
                后端接口会把文件存入 R2，把标题、价格、库存和媒体索引存入 D1。
              </span>
            </label>
          </form>

          <aside className="space-y-4">
            <section className="border border-[#c6baa6] bg-[#ebe5da] p-5">
              <h2 className="text-xl font-semibold">上传流程</h2>
              <ol className="mt-4 space-y-3 text-sm leading-6 text-[#5d554b]">
                <li>1. 选择多张照片或多个视频。</li>
                <li>2. 填写作品价格、库存、材质和描述。</li>
                <li>3. /api/products 接收表单，写入 D1 和 R2。</li>
                <li>4. 用户页面读取已发布作品。</li>
              </ol>
            </section>
            <section className="border border-[#c6baa6] bg-white/55 p-5">
              <h2 className="text-xl font-semibold">下一步接入</h2>
              <p className="mt-3 text-sm leading-6 text-[#5d554b]">
                管理员登录建议用 Cloudflare Access 免费方案或 Sites 的工作区身份，避免自建密码系统。
              </p>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
