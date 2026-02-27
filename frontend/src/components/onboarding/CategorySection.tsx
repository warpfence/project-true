"use client";

/**
 * CategorySection 컴포넌트.
 *
 * 4개 상담 분야 카드 섹션.
 */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EXPERT_TYPES } from "@/lib/constants";

export default function CategorySection() {
  const categories = Object.entries(EXPERT_TYPES).map(([key, value]) => ({
    type: key,
    ...value,
  }));

  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          4개 분야 전문가
        </h2>
        <p className="text-gray-500 mb-12">
          각 분야의 전문가가 맞춤형 상담을 제공합니다.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Card key={cat.type} className="text-center">
              <CardHeader className="pb-2">
                <span className="text-4xl">{cat.icon}</span>
                <CardTitle className="text-base mt-2">{cat.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {cat.type === "career" &&
                    "취업, 이직, 면접 준비, 자기소개서 등"}
                  {cat.type === "love" && "연애, 썸, 관계 고민, 이별 등"}
                  {cat.type === "fortune" && "사주팔자, 올해 운세, 궁합 등"}
                  {cat.type === "parenting" &&
                    "육아, 아이 발달, 교육, 부모 고민 등"}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
