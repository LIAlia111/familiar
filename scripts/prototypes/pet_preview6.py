def render(pixels, palette):
    out = ""
    for y in range(0, len(pixels) - 1, 2):
        for x in range(len(pixels[y])):
            t = pixels[y][x]
            b = pixels[y+1][x]
            tc = palette.get(t)
            bc = palette.get(b)
            if t == 0 and b == 0:
                out += " "
            elif t == 0:
                out += f"\033[48;2;{bc[0]};{bc[1]};{bc[2]}m▄\033[0m"
            elif b == 0:
                out += f"\033[38;2;{tc[0]};{tc[1]};{tc[2]}m▀\033[0m"
            else:
                out += f"\033[48;2;{bc[0]};{bc[1]};{bc[2]}m\033[38;2;{tc[0]};{tc[1]};{tc[2]}m▀\033[0m"
        out += "\n"
    return out

_ = 0

# ══════════════════════════════════════════════════════
# 熊猫 Panda  32x32
# ══════════════════════════════════════════════════════
pp = {
    1:(15,15,15),    # 黑
    2:(245,245,245), # 白
    3:(200,200,200), # 浅灰高光
    4:(80,80,80),    # 深灰轮廓
    5:(30,30,30),    # 黑鼻
    6:(50,50,50),    # 深灰阴影
}
Bk,W,Lg,Dg,Pn,Sh = 1,2,3,4,5,6
panda = [
 [_,_,Bk,Bk,Bk,_,_,_,_,_,_,_,_,_,_,_,_,Bk,Bk,Bk,_,_,_,_,_,_,_,_,_,_,_,_],
 [_,Bk,Bk,Bk,Bk,Bk,_,_,_,_,_,_,_,_,_,Bk,Bk,Bk,Bk,Bk,_,_,_,_,_,_,_,_,_,_,_,_],
 [_,Bk,Bk,Bk,Bk,Bk,Bk,Dg,Dg,Dg,Dg,Dg,Dg,Dg,Bk,Bk,Bk,Bk,Bk,Bk,_,_,_,_,_,_,_,_,_,_,_,_],
 [_,Bk,Bk,Bk,W,W,Dg,W,W,W,W,W,W,W,W,Dg,W,W,Bk,Bk,Bk,_,_,_,_,_,_,_,_,_,_,_],
 [_,_,Bk,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,Bk,_,_,_,_,_,_,_,_,_,_,_,_],
 [_,Dg,W,W,Lg,W,W,W,W,W,W,W,W,W,W,W,W,Lg,W,W,Dg,_,_,_,_,_,_,_,_,_,_,_],
 [_,Dg,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,Dg,_,_,_,_,_,_,_,_,_,_,_],
 [Dg,W,W,Bk,Bk,Bk,Bk,W,W,W,W,W,W,Bk,Bk,Bk,Bk,W,W,W,W,Dg,_,_,_,_,_,_,_,_,_,_],
 [Dg,W,Bk,Bk,Bk,Bk,Bk,Bk,W,W,W,W,Bk,Bk,Bk,Bk,Bk,Bk,W,W,W,Dg,_,_,_,_,_,_,_,_,_,_],
 [Dg,W,Bk,Bk,W,W,Bk,Bk,W,W,W,W,Bk,Bk,W,W,Bk,Bk,W,W,W,Dg,_,_,_,_,_,_,_,_,_,_],
 [Dg,W,Bk,Bk,Bk,Bk,Bk,W,W,W,W,W,W,Bk,Bk,Bk,Bk,Bk,W,W,W,Dg,_,_,_,_,_,_,_,_,_,_],
 [Dg,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,Dg,_,_,_,_,_,_,_,_,_,_],
 [Dg,W,W,W,W,W,W,W,W,W,Pn,Pn,W,W,W,W,W,W,W,W,W,Dg,_,_,_,_,_,_,_,_,_,_],
 [Dg,W,W,W,W,W,W,W,W,Pn,Pn,Pn,Pn,W,W,W,W,W,W,W,W,Dg,_,_,_,_,_,_,_,_,_,_],
 [_,Dg,W,W,W,W,W,W,W,Pn,Bk,Pn,Bk,Pn,W,W,W,W,W,W,Dg,_,_,_,_,_,_,_,_,_,_,_],
 [_,Dg,W,W,W,W,W,W,W,Pn,Pn,Pn,Pn,W,W,W,W,W,W,W,Dg,_,_,_,_,_,_,_,_,_,_,_],
 [_,_,Dg,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,Dg,_,_,_,_,_,_,_,_,_,_,_,_],
 [_,_,Dg,Bk,W,W,Bk,Bk,Bk,Bk,Bk,Bk,Bk,Bk,Bk,W,W,Bk,W,Dg,_,_,_,_,_,_,_,_,_,_,_,_],
 [_,_,Dg,Bk,Bk,Bk,Bk,Bk,Bk,Bk,Bk,Bk,Bk,Bk,Bk,Bk,Bk,Bk,Bk,Dg,_,_,_,_,_,_,_,_,_,_,_,_],
 [_,_,Dg,Bk,Bk,Bk,Bk,Bk,Bk,Bk,Bk,Bk,Bk,Bk,Bk,Bk,Bk,Bk,Bk,Dg,_,_,_,_,_,_,_,_,_,_,_,_],
 [_,_,_,Dg,W,W,W,W,W,W,W,W,W,W,W,W,W,W,Dg,_,_,_,_,_,_,_,_,_,_,_,_,_],
 [_,_,Dg,W,W,Dg,_,Dg,W,W,W,W,W,W,Dg,_,Dg,W,W,Dg,_,_,_,_,_,_,_,_,_,_,_,_],
 [_,_,Dg,W,W,Dg,_,Dg,W,W,W,W,W,W,Dg,_,Dg,W,W,Dg,_,_,_,_,_,_,_,_,_,_,_,_],
 [_,_,Dg,Sh,W,Dg,_,Dg,Sh,W,W,W,W,Sh,Dg,_,Dg,W,Sh,Dg,_,_,_,_,_,_,_,_,_,_,_,_],
 [_,_,Dg,Dg,Dg,_,_,_,Dg,Dg,Dg,Dg,Dg,Dg,_,_,_,Dg,Dg,Dg,_,_,_,_,_,_,_,_,_,_,_,_],
 [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
 [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
 [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
 [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
 [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
 [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
 [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
]

# ══════════════════════════════════════════════════════
# 猪 Pig  32x32
# ══════════════════════════════════════════════════════
pgp = {
    1:(160,60,80),   # 深粉轮廓
    2:(255,175,185), # 粉主体
    3:(255,210,215), # 浅粉高光
    4:(220,120,135), # 中粉阴影
    5:(15,15,15),    # 黑眼
    6:(255,145,160), # 鼻子粉
    7:(255,255,255), # 白眼白
}
Op,Pk,Lp,Mp,Bl,Np,Wh = 1,2,3,4,5,6,7
pig = [
 [_,_,_,_,Op,Op,Op,_,_,_,_,_,_,_,_,Op,Op,Op,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
 [_,_,_,Op,Pk,Pk,Pk,Op,_,_,_,_,_,_,Op,Pk,Pk,Pk,Op,_,_,_,_,_,_,_,_,_,_,_,_,_],
 [_,_,Op,Pk,Lp,Pk,Pk,Pk,Op,_,_,_,Op,Pk,Pk,Lp,Pk,Pk,Op,_,_,_,_,_,_,_,_,_,_,_,_,_],
 [_,Op,Pk,Pk,Pk,Pk,Pk,Pk,Pk,Op,Op,Pk,Pk,Pk,Pk,Pk,Pk,Pk,Pk,Op,_,_,_,_,_,_,_,_,_,_,_,_],
 [Op,Pk,Pk,Lp,Pk,Pk,Pk,Pk,Pk,Pk,Pk,Pk,Pk,Pk,Pk,Pk,Pk,Lp,Pk,Pk,Op,_,_,_,_,_,_,_,_,_,_,_],
 [Op,Pk,Lp,Lp,Pk,Pk,Pk,Pk,Pk,Pk,Pk,Pk,Pk,Pk,Pk,Pk,Lp,Lp,Pk,Pk,Op,_,_,_,_,_,_,_,_,_,_,_],
 [Op,Pk,Pk,Pk,Pk,Pk,Pk,Pk,Pk,Pk,Pk,Pk,Pk,Pk,Pk,Pk,Pk,Pk,Pk,Pk,Op,_,_,_,_,_,_,_,_,_,_,_],
 [Op,Pk,Pk,Wh,Wh,Wh,Wh,Pk,Pk,Pk,Pk,Pk,Pk,Wh,Wh,Wh,Wh,Pk,Pk,Pk,Op,_,_,_,_,_,_,_,_,_,_,_],
 [Op,Pk,Wh,Wh,Bl,Wh,Wh,Wh,Pk,Pk,Pk,Pk,Wh,Wh,Wh,Bl,Wh,Wh,Pk,Pk,Op,_,_,_,_,_,_,_,_,_,_,_],
 [Op,Pk,Wh,Bl,Bl,Bl,Wh,Wh,Pk,Pk,Pk,Pk,Wh,Wh,Bl,Bl,Bl,Wh,Pk,Pk,Op,_,_,_,_,_,_,_,_,_,_,_],
 [Op,Pk,Pk,Wh,Wh,Wh,Pk,Pk,Pk,Pk,Pk,Pk,Pk,Pk,Wh,Wh,Wh,Pk,Pk,Pk,Op,_,_,_,_,_,_,_,_,_,_,_],
 [Op,Pk,Pk,Pk,Pk,Pk,Pk,Pk,Pk,Pk,Pk,Pk,Pk,Pk,Pk,Pk,Pk,Pk,Pk,Pk,Op,_,_,_,_,_,_,_,_,_,_,_],
 [Op,Pk,Pk,Pk,Np,Np,Np,Np,Np,Np,Np,Np,Np,Np,Np,Np,Pk,Pk,Pk,Pk,Op,_,_,_,_,_,_,_,_,_,_,_],
 [Op,Pk,Pk,Np,Np,Bl,Bl,Np,Np,Np,Np,Np,Np,Bl,Bl,Np,Np,Pk,Pk,Pk,Op,_,_,_,_,_,_,_,_,_,_,_],
 [Op,Pk,Pk,Np,Np,Bl,Bl,Np,Np,Np,Np,Np,Np,Bl,Bl,Np,Np,Pk,Pk,Pk,Op,_,_,_,_,_,_,_,_,_,_,_],
 [Op,Pk,Pk,Pk,Np,Np,Np,Np,Np,Np,Np,Np,Np,Np,Np,Np,Pk,Pk,Pk,Pk,Op,_,_,_,_,_,_,_,_,_,_,_],
 [_,Op,Pk,Pk,Pk,Pk,Pk,Pk,Pk,Pk,Pk,Pk,Pk,Pk,Pk,Pk,Pk,Pk,Pk,Op,_,_,_,_,_,_,_,_,_,_,_,_],
 [_,_,Op,Pk,Mp,Pk,Pk,Pk,Pk,Pk,Pk,Pk,Pk,Pk,Pk,Pk,Mp,Pk,Op,_,_,_,_,_,_,_,_,_,_,_,_,_],
 [_,_,Op,Pk,Pk,Pk,Pk,Pk,Pk,Pk,Pk,Pk,Pk,Pk,Pk,Pk,Pk,Pk,Op,_,_,_,_,_,_,_,_,_,_,_,_,_],
 [_,_,Op,Mp,Pk,Pk,Pk,Pk,Pk,Pk,Pk,Pk,Pk,Pk,Pk,Pk,Pk,Mp,Op,_,_,_,_,_,_,_,_,_,_,_,_,_],
 [_,_,Op,Pk,Pk,Pk,Pk,Pk,Pk,Pk,Pk,Pk,Pk,Pk,Pk,Pk,Pk,Pk,Op,_,_,_,_,_,_,_,_,_,_,_,_,_],
 [_,_,Op,Pk,Pk,Op,_,_,Op,Pk,Pk,Pk,Pk,Op,_,_,Op,Pk,Op,_,_,_,_,_,_,_,_,_,_,_,_,_],
 [_,_,Op,Pk,Pk,Op,_,_,Op,Pk,Pk,Pk,Pk,Op,_,_,Op,Pk,Op,_,_,_,_,_,_,_,_,_,_,_,_,_],
 [_,_,Op,Mp,Pk,Op,_,_,Op,Mp,Pk,Pk,Mp,Op,_,_,Op,Pk,Op,_,_,_,_,_,_,_,_,_,_,_,_,_],
 [_,_,Op,Op,Op,_,_,_,_,Op,Op,Op,Op,_,_,_,_,Op,Op,_,_,_,_,_,_,_,_,_,_,_,_,_],
 [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
 [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
 [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
 [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
 [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
 [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
 [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
]

print()
print("\033[38;2;245;245;245m  ✦ [6] 熊猫  Panda\033[0m")
print(render(panda, pp))
print("\033[38;2;255;175;185m  ✦ [7] 猪  Pig\033[0m")
print(render(pig, pgp))
