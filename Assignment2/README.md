## 1. 요구사항
- 이름 이니셜 모델을 3D로 표현하기
- 버튼을 추가해 모델을 이동 및 회전, 크기 조절등의 기능을 추가하기
- `gl.uniformMatirx4fv`를 사용하기

## 2. 구현 사항
- x축,y축,z축으로의 회전
- zxy축 통합 회전
- 이동(translation)기능
- 크기 조절 버튼

## 3. 구현하지 못한 사항
- `gl.uniformMatirx4fv`를 사용해 모델을 3D로 표현하지 못했음
- 초기에는 view를 이용해서 시점을 옮겨서 3D공간 즉 (1,1,1)에서 (0,0,0)을 보는 view를 만든 후 이니셜을 만들려시도했지만 lookat 메서드와 perspective 함수를 사용 후 화면에 아무 도형이 보이지 않아서 2D화면에서 x축, y축,z축 회전 그리고 translation, scale를 구현

## 4. 결과 

![a2](https://github.com/KWAKMANBO/ComputerGraphics/assets/113917771/d4628ac6-adc8-420d-9900-41f2e1033d34)
