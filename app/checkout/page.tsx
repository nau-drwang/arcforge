import Link from "next/link";

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-[#f6f4ef] px-5 py-6 text-[#201d1a]">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 border-b border-[#d8d0c2] pb-5">
          <Link href="/" className="text-sm text-[#1f3f3c] underline">
            返回商店
          </Link>
          <h1 className="mt-3 text-3xl font-semibold">支付界面</h1>
          <p className="mt-2 max-w-2xl leading-7 text-[#5d554b]">
            这里保留订单确认和第三方支付入口。真正上线时可接 Stripe Checkout、PayPal Checkout 或手动转账确认。
          </p>
        </header>

        <div className="grid gap-5 lg:grid-cols-[1fr_0.8fr]">
          <form className="space-y-4 border border-[#c6baa6] bg-white/55 p-5">
            <label className="grid gap-2 text-sm font-medium">
              姓名
              <input className="border border-[#c6baa6] bg-white px-3 py-2" name="name" />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              邮箱
              <input className="border border-[#c6baa6] bg-white px-3 py-2" name="email" type="email" />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              收货地址
              <textarea className="min-h-24 border border-[#c6baa6] bg-white px-3 py-2" name="address" />
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <button className="bg-[#1f3f3c] px-4 py-3 font-medium text-white" type="button">
                Stripe 支付
              </button>
              <button className="border border-[#8b806f] px-4 py-3 font-medium" type="button">
                PayPal 支付
              </button>
            </div>
          </form>

          <aside className="border border-[#c6baa6] bg-[#ebe5da] p-5">
            <h2 className="text-xl font-semibold">订单摘要</h2>
            <dl className="mt-5 space-y-4 text-sm">
              <div className="flex justify-between gap-4">
                <dt>作品</dt>
                <dd className="font-medium">灰烬战斧领主</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>价格</dt>
                <dd className="font-medium">$420</dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-[#c6baa6] pt-4 text-base">
                <dt>合计</dt>
                <dd className="font-semibold">$420</dd>
              </div>
            </dl>
            <p className="mt-5 text-xs leading-5 text-[#776a59]">
              支付服务账号免费开通，但每笔成功交易通常会有平台手续费。
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}
