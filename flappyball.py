import pygame
import random

pygame.init()


SCREEN_WIDTH = 400
SCREEN_HEIGHT = 600
GRAVITY = 0.25
ball_JUMP = -6
PIPE_SPEED = 3
PIPE_GAP = 150

screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
clock = pygame.time.Clock()

game_font = pygame.font.SysFont("Arial", 50, bold=True)
small_font = pygame.font.SysFont("Arial", 25, bold=True)


ball_img = pygame.image.load('ball.png').convert_alpha()
ball_img = pygame.transform.scale(ball_img, (34, 24))
pipe_img = pygame.image.load('pipe.png').convert_alpha()
pipe_img = pygame.transform.scale(pipe_img, (50, 500))


ball_rect = ball_img.get_rect(center = (50, 300))
ball_movement = 0
pipes = []
score = 0
game_active = True

SPAWNPIPE = pygame.USEREVENT
pygame.time.set_timer(SPAWNPIPE, 1200)

def create_pipe():
    random_pipe_pos = random.randint(200, 450)
    bottom_rect = pipe_img.get_rect(midtop = (SCREEN_WIDTH + 50, random_pipe_pos))
    top_rect = pipe_img.get_rect(midbottom = (SCREEN_WIDTH + 50, random_pipe_pos - PIPE_GAP))
    return {"rect": bottom_rect, "scored": False}, {"rect": top_rect, "scored": False}

def draw_pipes(pipe_list):
    for pipe in pipe_list:
        if pipe["rect"].bottom >= SCREEN_HEIGHT:
            screen.blit(pipe_img, pipe["rect"])
        else:
            flip_pipe = pygame.transform.flip(pipe_img, False, True)
            screen.blit(flip_pipe, pipe["rect"])

def update_score(pipe_list, current_score):
    for pipe in pipe_list:
        if b_rect.left > pipe["rect"].right and not pipe["scored"]:
            pipe["scored"] = True
            current_score += 0.5 
    return current_score


def draw_score(status):
    if status == 'playing':
        score_surf = game_font.render(str(int(score)), True, (255, 255, 255))
        score_rect = score_surf.get_rect(center = (SCREEN_WIDTH//2, 80))
        screen.blit(score_surf, score_rect)
    
    if status == 'game_over':
  
        score_surf = game_font.render(f'Score: {int(score)}', True, (255, 255, 255))
        score_rect = score_surf.get_rect(center = (SCREEN_WIDTH//2, SCREEN_HEIGHT//2 - 50))
        screen.blit(score_surf, score_rect)
        

        restart_surf = small_font.render('PRESS SPACE TO RESTART', True, (255, 255, 255))
        restart_rect = restart_surf.get_rect(center = (SCREEN_WIDTH//2, SCREEN_HEIGHT//2 + 20))
        screen.blit(restart_surf, restart_rect)


while True:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
            exit()
        if event.type == pygame.KEYDOWN and event.key == pygame.K_SPACE:
            ball_movement = BALL_JUMP
            if not game_active:
                game_active = True
                pipes.clear()
                ball_rect.center = (50, 300)
                ball_movement = 0
                score = 0

        if event.type == SPAWNPIPE and game_active:
            pipes.extend(create_pipe())

    screen.fill((135, 206, 235))

    if game_active:
  
        ball_movement += GRAVITY
        ball_rect.centery += ball_movement
        screen.blit(ball_img, ball_rect)


        for pipe in pipes:
            pipe["rect"].centerx -= PIPE_SPEED
        
        score = update_score(pipes, score)
        pipes = [p for p in pipes if p["rect"].right > -50]
        draw_pipes(pipes)

  
        for pipe in pipes:
            if ball_rect.colliderect(pipe["rect"]): 
                game_active = False
        if ball_rect.top <= 0 or ball_rect.bottom >= SCREEN_HEIGHT: 
            game_active = False
        
        draw_score('playing')
    else:
       
        draw_pipes(pipes)
        screen.blit(ball_img, ball_rect)
    
        draw_score('game_over')

    pygame.display.update()
    clock.tick(60)

