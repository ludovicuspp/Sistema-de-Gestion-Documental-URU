# Contexto de build: carpeta backend (padre de security y commons).
# Ejemplo: docker build -f security/Dockerfile .

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 8080
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY ["commons/Sidae.Commons.csproj", "commons/"]
COPY ["security/Sidae.Security/Sidae.Security.csproj", "security/Sidae.Security/"]
RUN dotnet restore "security/Sidae.Security/Sidae.Security.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet build "security/Sidae.Security/Sidae.Security.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "security/Sidae.Security/Sidae.Security.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Sidae.Security.dll"]
