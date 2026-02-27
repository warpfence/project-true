"""전문가 API 라우터.

GET /api/experts, GET /api/experts/{expert_type}
"""

from fastapi import APIRouter, Depends, HTTPException, status

from app.application.use_cases.get_experts import GetExpertsUseCase
from app.domain.repositories.expert_repository import AbstractExpertRepository
from app.presentation.dependencies import get_expert_repository

router = APIRouter(prefix="/api/experts", tags=["전문가"])


def get_experts_use_case(
    expert_repo: AbstractExpertRepository = Depends(get_expert_repository),
) -> GetExpertsUseCase:
    """전문가 조회 Use Case 의존성을 제공한다."""
    return GetExpertsUseCase(expert_repository=expert_repo)


@router.get("")
async def get_experts(
    use_case: GetExpertsUseCase = Depends(get_experts_use_case),
):
    """전문가 목록을 조회한다 (4개)."""
    experts = await use_case.get_all()
    return [
        {
            "id": str(e.id),
            "expert_type": e.expert_type,
            "name": e.name,
            "description": e.description,
            "icon": e.icon,
        }
        for e in experts
    ]


@router.get("/{expert_type}")
async def get_expert_by_type(
    expert_type: str,
    use_case: GetExpertsUseCase = Depends(get_experts_use_case),
):
    """특정 분야 전문가 정보를 조회한다."""
    try:
        expert = await use_case.get_by_type(expert_type)
        return {
            "id": str(expert.id),
            "expert_type": expert.expert_type,
            "name": expert.name,
            "description": expert.description,
            "icon": expert.icon,
        }
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"해당 분야의 전문가가 없습니다: {expert_type}",
        )
